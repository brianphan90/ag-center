<template lang="pug">
	.dimChart
		svg(ref='svg')
</template>

<script>
import formatNumber from '@/lib/utils/formatNumber';
import colors from '@/assets/js/colors';
import * as d3 from 'd3';
import BaseChart from './BaseChart';
import ChartLegend from '../ChartLegend';

export default {
	name    : 'sbar-chart',
	extends : BaseChart,
	props   : {
		chart : {
			type : Object,
		},
		options : {
			type    : Object,
			default : () => ( {
				hasBarLabels : true
			} )
		}

	},
	data : () => ( {
		barLabelHeight  : 30,
		barLabelSpacing : 5
	} ),
	components : {
		ChartLegend
	},
	computed : {
		barWidth() {
			const { aw } = this;
			return Math.min( aw / this.chart.data.length, 50 );
		},
		barSpacing() {
			const { barWidth, data, aw } = this;
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
			this.updateDims( {
				l : 5,
				r : 5,
				t : 30
			} );
			const { values } = this.chart.data.map( entry => entry.label );
			const yValues = this.chart.data.map( entry => entry.value );
			// const sum = Object.keys( values ).reduce( ( total, key ) => total + values[key], 0 );
			const sum = this.getDataRange( yValues, false ).end;
			// const yValues = this.chart.data[0].map( datum => datum.value );
			const range   = { start : 0, end : sum };
			if ( this.hasBarLabels ) {
				this.updateDims( {
					t : this.t + this.barLabelHeight + this.barLabelSpacing
				} );
			}
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
			// Compute the position and size of the bars
			const barData   = this.newComputeBarData( );
			const barGroups = this.newDrawBars( barData );
			if ( this.options.hasBarLabels ) {
				console.log( 'here' );
				this.drawBarLabels( barGroups );
			}
			console.log( barGroups );
		},
		newComputeBarData( ) {
			const values = this.chart.data.map( entry => entry.value );
			const { end } = this.getDataRange( values, false );
			const sum = this.chart.data.reduce( ( total, entry ) => total + entry.value, 0 );
			return this.chart.data.map( ( entry, i ) => {
				const { value } = entry;
				const height = ( value / end ) * this.ah;
				const y = this.t + ( this.ah - height );
				return {
					width      : this.barWidth,
					barColor   : entry.barColor,
					labelColor : entry.labelColor,
					x          : this.getX( i ),
					// x     : this.l + xDims[i].x,
					label      : entry.label,
					value      : entry.value,
					y,
					height
				};
			} );
		},
		newDrawXaxis( barGroups ) {
			const xAxisLabels = barGroups
				.append( 'text' )
				.attr( 'class', 'x-axis-labels' )
				.attr( 'x', ( d, i ) => this.getTextX( i ) )
				.attr( 'y', this.t + this.ah )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'start' )
				.style( 'font-size', '12px' )
				.text( d => d.label );

			this.changeWithMode( {
				nodes   : xAxisLabels,
				options : {
					day : {
						style : [
							['fill', colors.grey],
						],
					},
					night : {
						style : [
							['fill', colors.white],
						],
					},
				},
			} );
			const barLabelNodes = barGroups.selectAll( '.x-axis-labels' );
			const barLabelWidths = Array.from( barLabelNodes._groups[0] ).map( a => a.getBBox().height );
			const biggestBarLabel = Math.max( ...barLabelWidths );
			const spaceBetweenBarAndXAxis = 2;
			this.updateDims( {
				b : biggestBarLabel + spaceBetweenBarAndXAxis
			} );
			return xAxisLabels;
		},
		newDrawBars( barData ) {
			const barGroups = this.canvas.selectAll( `bars-${this.id}` )
				.data( barData )
				.enter()
				.append( 'g' );
			barGroups
				.append( 'rect' )
				.attr( 'x', d => d.x )
				.attr( 'y', d => d.y )
				// .attr( 'fill', d => d.color )
				.attr( 'fill', d => d.barColor )
				.attr( 'height', d => d.height )
				.attr( 'width', d => d.width )
				.attr( 'stroke', d => d.barColor )
				.attr( 'opacity', 0.8 )
				.attr( 'stroke-width', d => '2' )
				.attr( 'class', `bar-${this.id} translate-${this.id}` );

			// For striped bar functionality
			// const roundToNearestMultipleOfEight = num => Math.ceil( Math.ceil( num ) / 8 ) * 8;
			// barGroups
			// 	.append( 'path' )
			// 	.attr( 'd', ( d, i ) => {
			// 		const x = this.getX( i ) + ( this.barWidth / 2 );
			// 		const point1 = {
			// 			x,
			// 			y : Math.round( this.h - this.b ),
			// 		};
			// 		const point2 = {
			// 			x,
			// 			y : Math.min( point1.y, roundToNearestMultipleOfEight( point1.y - this.getHeight( d.value ) ) ),
			// 		};
			// 		return this.pathFromPoints( [point1, point2] );
			// 	} )
			// 	.style( 'stroke', d => '#F8A79E' )
			// 	.style( 'stroke-dasharray', d => '2, 6' )
			// 	.style( 'stroke-width', d => this.barWidth );
			console.log( barGroups );
			return barGroups;
		},
		drawBarLabels( barGroups ) {
			const barLabelGroups = barGroups
				.append( 'g' );
			const textLabels = barLabelGroups.append( 'text' )
				.attr( 'x', ( d, i ) => this.getTextX( i ) )
				.attr( 'y', ( d ) => {
					const height = this.getHeight( d.value );
					const y = this.getY( height );
					return y - ( ( this.barLabelHeight / 2 ) + this.barLabelSpacing );
				} )
				.attr( 'class', 'bar-value' )
				.attr( 'text-anchor', 'middle' )
				.attr( 'dominant-baseline', 'middle' )
				.style( 'fill', d => d.labelColor )
				.style( 'font-weight', 'bold' )
				.style( 'font-family', 'Bitter' )
				.style( 'font-size', `${this.labelTextSize}px` )
				.text( d => formatNumber( d.value ) );
			const textDims = Array.from(
				textLabels._groups[0]
			).map(
				text => d3.select( text )
					.node()
					.getBBox()
			);
			const verticalPadding = 5;
			console.log( textDims );
			const maxTextWidth  = Math.max( ...textDims.map( dims => dims.width ) );
			const maxTextHeight = Math.max( ...textDims.map( dims => dims.height ) );
			const rectangleWidth = maxTextWidth + ( 2 * verticalPadding );
			const rectangleHeight  = maxTextHeight + ( 2 * verticalPadding );
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
				.attr( 'x', ( d, i ) => this.getTextX( i ) )
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
		getY( height ) {
			const { ah, t } = this;
			return ah + t - height;
		},
		getTextX( i ) {
			const {
				l,
				barWidth,
				barSpacing
			} = this;
			return ( l + ( barWidth * i ) + ( barSpacing * i ) + ( barWidth / 2 ) ) + ( barSpacing / 2 );
		},
		getHeight( value ) {
			const values = this.chart.data.map( entry => entry.value );
			const { end } = this.getDataRange( values, false );
			// + this assumes that the bottom of the range
			// + is always zero
			return ( value / end ) * this.ah;
		}
	}
};
</script>

<style lang='scss'>
	.dimChart{
		height: 100%;
		width: 100%;
		svg {
		// flex: 2 2 0
		height: 100%;
		width: 100%;
		}
	}
	// .chart{
	// 	display: flex;
	// 	align-items: stretch;
	// 	width: 100%;
	// 	height: 200px;
	// 	padding:0;
	// 	svg {
	// 	// flex: 2 2 0
	// 	position: relative;
	// 	height: 100%;
	// 	width: 100%;
	// 	border: 0px;;
	// 	}
	// }
</style>
