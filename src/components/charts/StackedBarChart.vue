<template lang='pug'>
	.chart
		svg(ref='svg')
		.legend
			chart-legend(:legend='this.legend'
			columns=1)
</template>

<script>
import formatNumber from '@/lib/utils/formatNumber';
import colors from '@/assets/js/colors';
import BaseChart from './BaseChart';
import ChartLegend from '../ChartLegend';

export default {
	name       : 'stacked-bar-chart',
	extends    : BaseChart,
	components : {
		ChartLegend
	},
	props : {
		chart : {
			type : Object,
		},
		legend : {
			type : Object,

		}
	},

	data : () => ( {
		// nothing yet
	} ),
	computed : {
		barWidth() {
			const { aw } = this;
			return Math.min( aw / this.chart.data.length, 70 );
		},
		barSpacing() {
			const { barWidth, aw } = this;
			console.log( barWidth );
			return ( aw - ( barWidth * this.chart.data.length ) ) / this.chart.data.length;
		},
		labelTextSize() {
			return this.barWidth * 0.55;
		}
	},
	mounted() {
		this.init( this.$refs.svg );
	},
	methods : {
		draw() {
			const { values } = this.chart.data[0];
			const yValues = Object.keys( values ).map( key => values[key] );
			const sum = Object.keys( values ).reduce( ( total, key ) => total + values[key], 0 );
			// const yValues = this.chart.data[0].map( datum => datum.value );
			const range   = { start : 0, end : sum };

			// draw y-axis labels
			const yAxisData = this.drawAxisIndicators( {
				axis           : 'y-right',
				transformLabel : text => formatNumber( text ),
				lines          : {
					numberOfIndicators         : 6,
					spaceBetweenLabelsAndLines : 10,
				},
				color : colors.colorPrimary,
				range,
			} );
			// console.log( yAxisData );
			// draw x-axis labels
			const xAxisData = this.drawAxisIndicators( {
				axis                       : 'x-bottom',
				values                     : this.chart.data,
				spaceBetweenLabelsAndChart : 10,
				labelStyle                 : [
					['font-size', '14px'],
					['font-weight', '700'],
					['font-family', '"Manjari", sans-serif'],
				],
			} );
			// xAxisData.forEach( ( item, key ) => console.log( getX( key ) ) );
			// Compute the position and size of the bars
			const barData   = this.myComputeBarData( xAxisData );
			// console.log( barData );
			const barGroups = barData.map( variety => this.drawBars( variety ) );
			console.log( barGroups );
			// barGroups.forEach( grouping => grouping._groups[0].forEach( g => console.log( g.__data__.text ) ) );
			barGroups.forEach( grouping => this.drawBarLabels( grouping ) );

		},

		// repeat for each item in data
		myComputeBarData( xDims ) {
			const totalData = this.chart.data.map( ( entry, i ) => {
				const barKeys = Object.keys( entry.values );
				const sum = barKeys.reduce( ( total, j ) => total + entry.values[j], 0 );
				let runningSum = 0;
				return barKeys.map( ( key ) => {
				// get the value and the height
					const value  = entry.values[key];
					const height = ( value / sum ) * this.ah;
					// determine the y value for the bar
					const y = this.t + ( ( runningSum / sum ) * this.ah );
					// add to running sum so we can
					// do y value calculations
					runningSum += value;
					return {
						width : this.barWidth, // 30px on each side
						color : this.legend[key].color,
						text  : formatNumber( value ),
						x     : this.getX( i ), // 30px to the left
						y,
						height,
					};
				} );
			} );
			return totalData;

		},

		drawBars( barData ) {
			// Draw the bars
			const barGroups = this.canvas.selectAll( `bars-${this.id}` )
				.data( barData )
				.enter()
				.append( 'g' );
			barGroups
				.append( 'rect' )
				.attr( 'x', d => d.x )
				.attr( 'y', d => d.y )
				.attr( 'fill', d => d.color )
				.attr( 'opacity', 0.80 )
				.attr( 'height', d => d.height )
				.attr( 'width', d => d.width )
				.attr( 'class', `bar-${this.id} translate-${this.id}` );

			return barGroups;
		},
		drawBarLabels( barGroups ) {
			barGroups
				.append( 'text' )
				.attr( 'class', `text-node-${this.id} translate-${this.id}` )
				.attr( 'x', d => ( d.x - d.width / 8 ) ) // change later to calculated value
				.attr( 'y', d => ( d.y + ( d.height + d.y ) ) / 2 - d.height / 4 )
				.attr( 'fill', d => d.color )
				.style( 'font-family', 'Bitter' )
				.attr( 'text-anchor', 'end' )
				.attr( 'dominant-baseline', 'text-before-edge' )
				// .style( 'opacity', 0 )
				.text( d => d.text );
		},
		drawXAxisIndicators( options ) {
			const {
				axis,
				values,
				spaceBetweenLabelsAndChart,
				labelStyle,
			} = options;

			const getX = ( i ) => {
				const { aw, l } = this;

				return l + ( ( aw / ( values.length + 1 ) ) * ( i + 1 ) );
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

			// ? center texts as necessary
			// const totalTextSpace = xAxisLabelWidths.reduce( ( sum, w ) => sum + w, 0 );
			// const leftOverSpace  = this.aw - totalTextSpace;
			// const spaceAround    = ( leftOverSpace / ( values.length + 1 ) );

			return xAxisLabelDims;

		},
		getX( i ) {
			const {
				l,
				barWidth,
				barSpacing,
			} = this;
			const x = l + ( barWidth * i ) + ( barSpacing * i ) + ( barSpacing / 2 );
			return x;
		},

	}
};
</script>

<style lang='scss'>
	.chart{
		// display: flex;
		// align-items: stretch;
		// width: 100%;
		// height: 300px;
		height: 100%;
		width: 100%;

		svg {
		// flex: 2 2 0
		height: 100%;
		width: 70%
		};
		.legend{
			display: inline-block;
			vertical-align: top;
		}
	}

</style>
