<script>
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';

export default {
	props : {
		data : {
			type : [Array, Object],
		},
		legend : {
			type : Object,
		},
	},

	data : () => ( {
		canvas : null,
		id     : uuid(),
		h      : 0, // height
		w      : 0, // width
		l      : 0, // left offset
		r      : 0, // right offset
		t      : 0, // top offset
		b      : 0, // bottom offset
	} ),

	computed : {
		orderedLegend() {
			const legend = Object.keys( this.legend ).map( ( key ) => {
				const value = this.legend[key];
				return {
					key,
					...value
				};
			} );

			return legend.filter( a => a.order !== undefined ).sort( ( a, b ) => a.order - b.order );
		},

		ah() { // available height
			const { h, t, b } = this;

			return h - ( t + b );
		},

		aw() { // available width
			const { w, r, l } = this;

			return w - ( r + l );
		},

	},

	beforeDelete() {
		window.removeEventListener( 'resize', this.reset );
	},

	methods : {
		init( svgEl ) {
			this.resetDims();

			this.canvas = d3.select( svgEl );
			this.draw();

			window.addEventListener( 'resize', this.reset, { passive : true } );
		},

		reset() {
			this.canvas
				.selectAll( '*' )
				.remove();

			this.resetDims();
			this.draw();
		},

		resetDims() {

			const {
				clientWidth  : w,
				clientHeight : h,
			} = this.$refs.svg;

			this.h = h;
			this.w = w;
			this.t = 0;
			this.b = 0;
			this.l = 0;
			this.r = 0;
		},

		updateDims( props ) {
			const keys = Object.keys( props );
			const allowed = {
				t : true,
				b : true,
				l : true,
				r : true,
				h : true,
				w : true,
			};

			keys.forEach( ( key ) => {
				if ( !allowed[key] ) {
					console.warning( `Key ${key} cannot be updated using updateDims()` );

					return;
				}
				this[key] = props[key];
			} );
		},

		realignAxisLabels() {
			this.canvas.selectAll( '.axis-labels' )
				.attr( 'x', d => d.x() )
				.attr( 'y', d => d.y() );

			this.canvas.selectAll( '.axis-indicators' )
				.attr( 'd', d => d.path() );
		},

		drawAxisIndicators( options ) {
			const yAxis = /y(-(left|right))?/;
			const xAxis = /x(-(top|bottom))?/;

			if ( yAxis.test( options.axis ) ) {
				return this.drawYAxisIndicators( options );
			}

			if ( xAxis.test( options.axis ) ) {
				return this.drawXAxisIndicators( options );
			}

			throw new Error( `"${options.axis}" is not a valid axis. Expected one of\n[\n  'y',\n  'y-left',\n  'y-right',\n  'x',\n  'x-bottom',\n  'x-top',\n]` );
		},

		drawYAxisIndicators( options ) {
			const {
				axis,
				range,
				lines,
				postChar,
				color,
				transformLabel,
			} = options;

			const {
				numberOfIndicators,
				spaceBetweenLabelsAndLines,
			} = lines;

			/* draw initial lines and indicators */
			const rangeDifference = range.end - range.start;

			/* add text labels */

			const labelData = [];
			for ( let i = 0; i < numberOfIndicators; i++ ) {

				const dominantBaseline = ( () => {
					if ( i === numberOfIndicators - 1 ) {
						return 'text-before-edge';
					}

					if ( i === 0 ) {
						return 'text-after-edge';
					}

					return 'middle';
				} )();

				const y = ( () => {
					const bottomOfChart      = this.t + this.ah;
					const distanceFromBottom = i * ( this.ah / ( numberOfIndicators - 1 ) );

					return bottomOfChart - distanceFromBottom;
				} );

				const x     = () => ( ( axis === 'y-right' ) ? this.w - this.r : this.l );
				const x2    = () => ( ( axis === 'y-right' ) ? x() - this.aw : x() + this.aw );
				const pathX = () => ( ( axis === 'y-right' ) ? x() - spaceBetweenLabelsAndLines : x() + spaceBetweenLabelsAndLines );

				const textValue = Math.round( range.start + ( ( i / ( numberOfIndicators - 1 ) ) * rangeDifference ) );
				const label     = transformLabel ? transformLabel( textValue ) : textValue;

				const textAnchor = ( axis === 'y-right' ? 'start' : 'end' );

				labelData.push( {
					x,
					x2,
					y,
					y2   : y,
					text : `${label}${postChar || ''}`,
					path : () => `M ${pathX()}, ${y()} L ${x2()}, ${y()}`,
					dominantBaseline,
					textAnchor,
					color,
				} );

			}

			const lineIndicatorGroups = this.canvas
				.selectAll( `line-indicators-${this.id}` )
				.data( labelData )
				.enter()
				.append( 'g' ) // will append as many g's as the length of labelData
				.attr( 'class', `line-indicators-${this.id}` );

			if ( options.labels !== false ) {

				/* draw line lables */
				const lineLabels = lineIndicatorGroups.append( 'text' )
					.attr( 'class', `line-indicators label-${this.id} axis-labels dynamic-text-${this.id}` )
					.attr( 'dominant-baseline', d => d.dominantBaseline )
					.attr( 'x', d => d.x() )
					.attr( 'y', d => d.y() )
					.style( 'font-size', '10px' )
					.style( 'fill', color )
					.text( d => d.text )
					.attr( 'text-anchor', d => d.textAnchor );

				/* right align text */

				const lineLabelWidths  = Array.from( lineLabels._groups[0] ).map( a => a.getBBox().width );
				const biggestLineLabel = Math.max( ...lineLabelWidths );

				const dims = ( () => {
					const newWidth = ( biggestLineLabel + spaceBetweenLabelsAndLines );

					if ( axis === 'y-right' ) {
						return {
							r : newWidth,
						};
					}

					return {
						l : newWidth,
					};
				} )();

				this.updateDims( dims );
				this.realignAxisLabels();

			}

			/* draw lines */
			lineIndicatorGroups.append( 'path' )
				.attr( 'd', d => d.path() )
				.attr( 'class', `dynamic-stroke-${this.id} axis-indicators` )
				.style( 'stroke-dasharray', '2, 4' )
				.style( 'stroke', color );

			return lineIndicatorGroups;

		},

		drawXAxisIndicators( options ) {
			const {
				axis,
				values,
				spaceBetweenLabelsAndChart,
				labelStyle,
			} = options;
			console.log( values );
			const getX = ( i ) => {
				const { aw, l } = this;
				const ret = l + ( ( aw / ( values.length + 1 ) ) * ( i + 1 ) );
				console.log( ret );
				return ret;
			};

			const xAxisData = values.map( ( datum, i ) => {
				const y = () => ( ( axis === 'x-top' ) ? this.t : this.t + this.ah );
				const x = () => getX( i );

				return {
					...datum,
					x,
					y,
					textAnchor       : 'middle',
					dominantBaseline : ( axis === 'x-top' ) ? 'text-before-edge' : 'text-after-edge',
				};
			} );

			const xAxisLabels = this.canvas
				.selectAll( 'x-axis-labels axis-label' )
				.data( xAxisData )
				.enter()
				.append( 'text' )
				.attr( 'text-anchor', d => d.textAnchor )
				.attr( 'x', d => d.x() )
				.attr( 'y', d => d.y() )
				.attr( 'dominant-baseline', d => d.dominantBaseline )
				.style( 'fill', d => d.color )
				.text( d => d.label );

			if ( labelStyle ) {
				this.applyMethods( xAxisLabels, 'style', labelStyle );
			}

			const xAxisLabelDims    = Array.from( xAxisLabels._groups[0] ).map( a => a.getBBox() );
			const xAxisLabelHeights = xAxisLabelDims.map( a => a.height );
			// const xAxisLabelWidths  = xAxisLabelDims.map( a => a.width );
			const biggestXAxisLabel = Math.max( ...xAxisLabelHeights );

			const dims = ( () => {
				if ( axis === 'y-top' ) {
					return {
						t : biggestXAxisLabel + spaceBetweenLabelsAndChart,
					};
				}

				return {
					b : biggestXAxisLabel + spaceBetweenLabelsAndChart,
				};
			} )();

			this.updateDims( dims );
			this.realignAxisLabels();
			return xAxisData;

		},

		applyMethods( nodes, method, options = [] ) {
			options.reduce( ( d3item, option ) => {
				const [prop, value] = option;

				return d3item[method]( prop, ( d ) => {
					if ( typeof value === 'function' ) {
						return value( d );
					}

					return value;
				} );
			}, nodes );
		},

		getDataRange( yValues, scaled ) {
			const biggest    = Math.max( ...yValues );
			const smallest   = Math.min( ...yValues );
			const difference = ( biggest - smallest );
			if ( difference === 0 ) {

				let power = 0;

				while ( biggest / ( 10 ** power ) > 10 ) {
					power += 1;
				}

				const increment = 10 ** power;

				return {
					start : scaled ? Math.floor( biggest / increment ) * increment : 0,
					end   : Math.ceil( biggest / increment ) * increment,
				};

			}

			// factor of ten to multiply
			// for the label's scale
			const scale = ( () => {

				let power = 0;

				while ( difference / ( 10 ** power ) > 10 ) {
					power += 1;
				}

				return power;

			} )();
			const relevantIncrement =  10 ** scale;

			// we'll start by trying to do a
			// scale from the closest instance of
			// our relevant increment to a point
			// four more relevantIncrements away
			const start = !scaled ? 0 : ( Math.floor( smallest / relevantIncrement ) * relevantIncrement );
			const range = ( Math.ceil( ( difference + smallest - start ) / relevantIncrement ) ) * relevantIncrement;
			const end   = start + range;

			return {
				start,
				end,
			};
		},

		getYValue( value, range ) {
			const { t, ah } = this;
			const { end, start } = range;

			const fraction = ( value - start ) / ( end - start );

			return t + ( ah - ( fraction * ah ) );
		},

		getLinearFunctionFromTwoPoints( pointOne, pointTwo ) {
			return ( x ) => {
				// rise over run. important
				const slope = ( pointOne.y() - pointTwo.y() ) / ( pointOne.x() - pointTwo.x() );

				// b = y - m(x);
				const b = pointOne.y() - ( slope * pointOne.x() );

				// y = m(x) + b;
				return ( slope * x ) + b;
			};
		},

		wrapText( text, width ) {

			const nodes = Array.from( text._groups[0] );

			nodes.forEach( ( node ) => {
				const textNode   = d3.select( node );
				const totalWords = textNode
					.text()
					.split( /\s+/ )
					.reverse();

				const lineHeight = 1.1; // ems
				const y          = textNode.attr( 'y' );
				const x          = textNode.attr( 'x' );
				const dy         = parseFloat( textNode.attr( 'dy' ) ) || 0;

				let tspan = textNode
					.text( null )
					.append( 'tspan' )
					.attr( 'x', x )
					.attr( 'y', y )
					.attr( 'dy', `${dy}em` );

				let line       = [];
				let lineNumber = 0;
				while ( totalWords.length ) {
					const word = totalWords.pop();

					// add this word to the line
					line.push( word );

					// set the tspan's content to
					// the value of our line
					tspan.text( line.join( ' ' ) );

					// determine if the line is now
					// overflowing
					const textLength = tspan
						.node()
						.getComputedTextLength();

					const overflowing = textLength > width;

					if ( overflowing ) {
						// remove that word, as it was
						// too long
						line.pop();

						// reset the text to the line without
						// the word that overflowed
						tspan.text( line.join( ' ' ) );

						// put this word in the next line
						line = [word];

						// add a new tsapn
						tspan = textNode
							.append( 'tspan' )
							.attr( 'x', x )
							.attr( 'y', y )
							.attr( 'dy', `${( ++lineNumber * lineHeight ) + dy}em` )
							.text( word );
					}
				}

				textNode.selectAll( 'tspan' )
					.attr( 'dy', ( d, i, tspans ) => {

						const numberOfLines = Array.from( tspans )
							.filter( a => a.innerHTML !== '' )
							.length - 1;

						const tspanNode  = tspans[i];
						const startingDy = parseFloat( d3.select( tspanNode ).attr( 'dy' ), 10 );

						const halfTotalTextHeight = ( ( numberOfLines / 2 ) * lineHeight );
						const linePosition        = ( lineHeight * lineNumber );

						// centers the wrapper text
						return `${( startingDy || 0 ) - linePosition + halfTotalTextHeight}em`;

					} );
			} );
		},

		pathFromPoints( points, closed = true ) {

			const endCharacter = closed ? ' Z' : '';
			const path         = points.reduce( ( a, b, i ) => {

				if ( typeof a !== 'object' ) {
					return `${a} L ${b.x} ${b.y}${i === ( points.length - 1 ) ? endCharacter : ''}`;
				}

				return `M ${b.x} ${b.y}`;

			}, {} );

			return path;

		},
	},
};
</script>
