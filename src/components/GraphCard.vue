<template lang="pug">
b-container
	b-card.chartCard(no-body)
		b-card-body.reg(v-if="!showYearSelect")
			span.float-right(@click-stop='toggleFullScreen')
				b-img(:src='require("../assets/svgs/expand.svg")')
			.chartTitleContainer
				b-card-title.chartTitle {{ title }}
				b-card-sub-title.chartSubTitle.mt-1 {{ subTitle }}
			b-card-body.chart
				.chart(v-if="this.chartType=='PayableBarChart'")
					SbarChart(:chart='currentData' :options='options')
				.chart(v-if="this.chartType=='StackedBarChart'")
					SbarChart(:chart='currentData' :options='options')
				.chart(v-if="this.chartType=='InsectBarChart'")
					aside
						.legend
							h1 {{ this.currentData.data[0].value }}
							h2 Pounds Damaged in 2020
						SbarChart(:chart='currentData' :options='options' :key='currentData')
				.chart(v-if="this.chartType=='InsectDamageByVariety'")
				.chart(v-if="this.chartType=='stackedBarChart'")
					StackedBarChart(:chart='currentData' :options='options' :key='currentData' :legend='legend')
				.chart(v-if="this.chartType=='PayableYieldByVariety'")
				.chart(v-if="this.chartType=='barChart'")
					SbarChart(:chart='currentData' :options='options' :key='currentData')
				//- simpleBarChart.chart(width = "500" height = "200" maxBars.number = "10" numVerticleTicks.number = "5" roundedCorners.number = "10" barColor = "red" )
		b-card-body.year(v-else)
			b-card-body
				b-list-group.yearCard(flush :style='determinColor')
					b-list-group-item.yearGroup(
						v-for="year in years"
						:key="year"
						:style="determinColor"
						@click="setYear"
					)
						.yearGroupItem.mb-md-1.pt-md-2 {{ year }}
		b-card-footer.select( curfooter-bg-variant='white' :class='showYearSelect ? "select" : "select yearShadow"')
			b-container.selectYear(v-if='!selectYear')
				b-row.yearMenu(v-if='multipleYears')
					b-col.p-0(cols="5" style="text-align: left;")
						.title Select year
					b-col.p-0(cols="2")
						.selectedYear {{ yearSelected }}
					b-col.mt-1.hamburgerWrapper(@click="chooseYear" style="text-align: right;")
						b-img.hamburger(:src='require("../assets/svgs/hamburger.svg")')
				b-row(v-else)
					b-col.p-0(cols="5" style="text-align: left;")
						.title() No Filters
			b-card-text.noFilter(v-else style="text-align: left;") No Filters

</template>

<script>
/*eslint-disable*/
import StackedBarChart from '@/components/charts/StackedBarChart';
import SbarChart from '@/components/charts/fBarChart';

const currentYear = new Date().getFullYear() - 1;

export default {
	name       : 'GraphCard',
	components : {
		SbarChart,
		StackedBarChart
	},
	props : {
		chartTitle : {
			type : String
		},
		id : {
			type : String
		},
		title : {
			type : String
		},
		subTitle : {
			type : String
		},
		chartData : {
			type : Array,
		},
		chartType : {
			type : String
		},
		selectYear : {
			type : Boolean
		},
		options : {
			type: Object
		},
		multipleYears: {
			type : Boolean
		},
		legend : {
			type : Object
		}
	},
	data : () => ( {
		showYearSelect : false,
		yearSelected   : currentYear,
		hoverRed       : 'rgba(248, 167, 158, 0.44)',
		hoverYellow    : 'rgba(229, 191, 17, 0.24)',
		hoverGreen     : '#e5ebb8',
		fontRed        : '#ed1c24',
		fontYellow     : '#d0ac04',
		fontGreen      : '#89b831',
		currentData    : null,
	
	} ),
	methods : {
		chooseYear() {
			this.showYearSelect = !this.showYearSelect;
		},
		setYear( value ) {
			this.yearSelected = parseInt( value.toElement.innerText, 10 );
			this.showYearSelect = !this.showYearSelect;
		},
		toggleFullScreen() {
			this.fullScreen = !this.fullScreen;
			if ( this.fullScreen ) {
				this.$store.dispatch( 'hideNavBar' );
			}
			else {
				this.$store.dispatch( 'showNavBar' );
			}
		},
		getSelectedYearData() {
			const selected = this.chartData.find( item => item.year === this.yearSelected );
			return selected;
		}
	},
	computed : {
		years() {
			const startYear = 2018;
			const thisYear = new Date().getFullYear();
			const years = [];
			for ( let i = startYear; i < thisYear; i++ ) {
				years.push( i );
			}
			return years;
		},
		determinColor() {
			switch ( this.title ) {
				case 'QualitySummary':
					return { '--font-color' : this.fontRed, '--background-color-hover' : this.hoverRed };
				case 'InsectDamage': 
					return { '--font-color' : this.fontYellow, '--background-color-hover' : this.hoverYellow };
				default:
					return { '--font-color' : this.fontGreen, '--background-color-hover' : this.hoverGreen };
			}
		}
	},
	watch :{
		yearSelected(){
			this.currentData=this.getSelectedYearData();
		}
	},
	created() {
		if ( this.chartData.length > 1 ) { // multiple years
			this.currentData = this.getSelectedYearData();
		}
		else {
			this.currentData = this.chartData[0]; 
		}
	}
};
</script>

<style lang="scss">
.container {
	max-width: none !important;
	.chartCard {
		background: $color;
		border-radius: 20px;
		width: 90%;
		max-height: 660px;
		margin: 25px auto 0 auto;
		box-shadow: 0 5px 4px 0 rgba(90,110,114,0.08), 0 10px 35px 0 rgba(90, 110, 114, 0.16);
		.chartTitelContainer {
			float: left;
			width:60%;
				.chartTitle {
					font-family: Manjari;
					font-weight: 700;
					font-size: 30px;
					line-height: 35.16px;
					color: #5A726A;
					text-align: left;
				}
				.chartSubTitle {
					font-family: Manjari;
					font-weight: 400;
					font-size: 14px;
					line-height: 17.08px;
					color: #5A726A;
					padding-top: 0px;
					text-align: left;
				}
		}
		.chartLegendContainer {
			float:right;
			width:40%;
		}
		.year {
			font-family: Manjari;
			font-weight: 700;
			font-size: 22px;
			line-height: 22px;
			max-height: 25%;
			.yearCard {
				max-height: 200px;
				overflow-y: auto;
				&::-webkit-scrollbar {
					width: .5em;
				}
				&::-webkit-scrollbar-thumb {
					border-radius: 20px;
					background-color: var(--font-color);
				}
				.yearGroup {
					border: none !important;
					.yearGroupItem {
						padding-top: 3%;
						margin-bottom: -3%;
						width: 30%;
						color: var(--font-color);
						border-radius: 30px;
						&:hover {
							background-color: var(--background-color-hover);
						}
					}
				}
			}
		}
		.select {
			border-radius: 0 0 20px 20px !important;
			border: none;
			.title {
				font-family: Manjari;
				font-weight: 700;
				font-size: 18px;
				line-height: 40px;
				letter-spacing: 0.05em;
				color: #5a726a;
				text-align: left;
			}
			.selectedYear {
				font-family: Manjari;
				font-weight: 700;
				font-size: 18px;
				line-height: 40px;
				letter-spacing: 0.05em;
				color: #98a6a2;
			}
			.hamburgerWrapper {
				text-align: right !important;
				.hamburger {
					color: #5a726a;
					margin-right: 0;
					margin-left: auto;
				}
			}
		}
		.yearShadow {
			box-shadow: 0 -1px 4px rgba(90, 110, 114, 0.18), 0 0 15px rgba(90, 110, 114, 0.12);
		}
		.noFilter {
			font-family: Manjari;
			font-weight: 700;
			font-size: 18px;
			line-height: 18px;
			letter-spacing: 0.05em;
			color: rgba(90, 114, 106, 0.6);
		}
	}
}
aside {
		display: flex;
		// flex-direction: column;
		// justify-content: space-between;
		// flex: 1 1 0;
		// vertical-align: bottom;
		.legend {
			text-align: left;
			width: 40%
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
}

</style>
