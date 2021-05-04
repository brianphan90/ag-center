<template lang='pug'>
.bar-chart(:id='id')
	svg(ref='svg')
		defs
			linearGradient(:id='`gradient-${id}`' :x1="l" :y1="t" :x2="l + aw" :y2="t" gradientUnits="userSpaceOnUse")
				stop(stop-color="#EED667" stop-opacity="0")
				stop(offset="0.128101" stop-color="#EED667" stop-opacity="0.19")
				stop(offset="0.8698" stop-color="#EED667" stop-opacity="0.19")
				stop(offset="1" stop-color="#EED667" stop-opacity="0")
</template>

<script>
import formatNumber from '@/lib/utils/formatNumber';
import { format } from 'date-fns';
import colors from '@/assets/js/colors';
import BaseChart from './BaseChart';

export default {
	name : 'bar-chart',

	extends : BaseChart,

	props : {
		chart : {
			type : Object,
		},
	},

	data : () => ( {
		// nothing
	} ),

	computed : {
		numOfBars() {
			return Object.keys( this.chart.data ).length;
		},
		maxBarWidth() {
			const { aw, numOfBars } = this;
			return aw / numOfBars;
		},
		barWidth() {
			const { maxBarWidth } = this;
			return Math.min( maxBarWidth, 25 );
		},
		barPadding() {
			const { barWidth, numOfBars, aw } = this;
			return ( aw - ( barWidth * numOfBars ) ) / numOfBars;
		},
		range() {

			const values = this.chart.data.map( item => item.value );
			const dataRange = this.getDataRange( values, false );
			return {
				min : dataRange.start,
				max : dataRange.end
			};


		}
	},

	mounted() {
		this.init( this.$refs.svg );
	},

	methods : {

		draw() {

			// get data range
			const yValues = this.chart.data.map( datum => datum.value );
			const range   = this.getDataRange( yValues );

			// draw y-axis labels
			this.drawAxisIndicators( {
				axis           : 'y-right',
				transformLabel : text => formatNumber( text ),
				lines          : {
					numberOfIndicators         : 5,
					spaceBetweenLabelsAndLines : 10,
				},
				color : colors.colorPrimary,
				range,
			} );

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
			console.log( xAxisData );
			console.log( xAxisData.forEach( x => console.log( x.x() ) ) );
			const barGroups = this.createBarGroup( this.chart.data );
			this.drawBars( barGroups );
		},

		createBarGroup( barData ) {
			return this.canvas.selectAll( `bars-${this.id}` )
				.data( barData )
				.enter()
				.append( 'g' );
		},
		drawBars( barGroups ) {
			barGroups
				.append( 'rect' )
				.attr( 'x', ( d, i ) => this.getX( i ) )
				.attr( 'y', d => this.getY( this.getHeight( d.value ) ) )
				.attr( 'fill', d => d.barColor )
				.attr( 'height', d => this.getHeight( d.value ) )
				.attr( 'width', d => this.barWidth );
			return barGroups;
		},

		getY( height ) {
			const { ah, t } = this;
			return ah + t - height;
		},
		getX( i ) {
			const { aw, l, barWidth } = this;
			const ret = ( l + ( ( aw / ( this.chart.data.length + 1 ) ) * ( i + 1 ) ) ) - barWidth / 2;
			console.log( ret );
			return ret;
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
			const { max } = this.range;
			return ( value / max ) * this.ah;
		}
	}


};
</script>

<style lang='scss'>
.bar-chart {
	display: flex;
	align-items: stretch;
	width: 100%;

	aside {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1 1 0;

		legend {
			text-align: left;

			h1,
			h2 {
				display: inline-block;
				text-align: left;
			}

			h1 {
				font-weight: 700;
				color: $color-accent;
			}

			h2 {
				font-family: "Manjari", sans-serif;
				font-size: 18px;
				font-weight: 400;
			}
		}

		footer p {
			font-family: 'Manjari', sans-serif;
			text-align: left;
			font-size: 12px;

			span {
				display: inline-block;
			}
		}
	}

	svg {
		flex: 2 2 0;
	}
}
</style>
