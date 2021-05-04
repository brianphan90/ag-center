<template lang='pug'>
.line-chart(:id='id')
	aside
		legend
			h1 {{ total }}
			h2 {{ chart.label }}
		footer
			p
				span Last updated
				span {{ lastUpdated }}
	//- can now be found by
	//- using this.$refs.svg
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
	name : 'line-chart',

	extends : BaseChart,

	props : {
		chart : {
			type : Object,
		},
	},

	data : () => ( {
		// nothing yet
	} ),

	computed : {
		total() {
			const { data } = this.chart;
			const total    = data.reduce( ( sum, item ) => sum + item.value, 0 );

			console.log( total );

			return formatNumber( total );
		},
		lastUpdated() {
			const { updatedAt } = this.chart;

			return format( new Date( updatedAt ), 'LLLL do, yyyy' );
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

			console.log( range );
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

			// draw line and shaded
			// area under chart
			this.drawShadedLine( xAxisData, range );
			console.log( xAxisData );
			// draw points
			this.drawPoints( xAxisData, range );
		},

		drawShadedLine( xAxisData, range ) {
			if ( xAxisData.length < 2 ) {
				return;
			}

			const [pointOne, pointTwo] = xAxisData
				.slice( 0, 2 )
				.map( point => ( {
					x : point.x,
					y : () => this.getYValue( point.value, range ),
				} ) );

			const fOfFirstLine = this.getLinearFunctionFromTwoPoints( pointOne, pointTwo );

			const [secondLastPoint, lastPoint] = xAxisData
				.slice( xAxisData.length - 2, xAxisData.length )
				.map( point => ( {
					x : point.x,
					y : () => this.getYValue( point.value, range ),
				} ) );

			const fOfSecondLine = this.getLinearFunctionFromTwoPoints( secondLastPoint, lastPoint );

			const linePoints = xAxisData.map( ( datum, i ) => ( {
				y : ( () => {
					if ( i === 0 ) {
						return fOfFirstLine( this.l );
					}

					if ( i === xAxisData.length - 1 ) {
						return fOfSecondLine( this.l + this.aw );
					}

					return this.getYValue( datum.value, range );
				} )(),
				x : ( () => {
					if ( i === 0 ) {
						return this.l;
					}

					if ( i === xAxisData.length - 1 ) {
						return this.l + this.aw;
					}

					return datum.x();
				} )(),
			} ) );

			const startPoint = {
				x : this.l,
				y : this.t + this.ah,
			};

			const endPoint = {
				x : this.l + this.aw,
				y : this.t + this.ah,
			};

			const points = [
				startPoint,
				...linePoints,
				endPoint,
			];

			this.canvas
				.append( 'path' )
				.attr( 'd', this.pathFromPoints( points ) )
				.style( 'fill', `url(#gradient-${this.id})` ); // look in mark up
		},

		drawPoints( xAxisData, range ) {
			const linePoints = xAxisData.map( datum => ( {
				x : datum.x(),
				y : this.getYValue( datum.value, range ),
			} ) );

			this.canvas
				.append( 'path' )
				.attr( 'd', this.pathFromPoints( linePoints, false ) )
				.style( 'stroke-width', '4px' )
				.style( 'stroke', colors.colorAccent )
				.style( 'fill', 'transparent' );

			this.canvas
				.selectAll( '.points' )
				.data( xAxisData )
				.enter()
				.append( 'circle' )
				.attr( 'cx', d => d.x() )
				.attr( 'cy', d => this.getYValue( d.value, range ) )
				.attr( 'r', '5' )
				.style( 'stroke-width', '4px' )
				.style( 'stroke', d => d.color )
				.style( 'fill', colors.bgColor );
		}

	}
};
</script>

<style lang='scss'>
.line-chart {
	display: flex;
	align-items: stretch;
	width: 100%;

	aside {
		// display: flex;
		// flex-direction: column;
		justify-content: space-between;
		// flex: 1 1 0;

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
