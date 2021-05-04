<template lang="pug">

	b-container.summary-view(fluid v-if="!showEmail")
		b-row.header(align-v="center")
			b-col
				h1.title Entity Summary
				h6.sub-title {{getContractName}}
		b-row.button-section(align-v="center")
			b-col
				b-button.btn.dark-btn.mr-3(@click="toggleEmail")
					span.pr-2.align-middle
						BIconEnvelope
					| Email
				b-button.btn
					span.pr-2.align-middle
						BIconDownload
					| Save
		b-row.chart-section
			b-col
				GraphCardDeck(:chartData='finalChartData')
	Email(v-else :only-title="this.$route.name" email-page-type="summary" :email-type="this.$route.name")
</template>

<style lang="scss" scoped>
.barChart{
	margin:auto;
	width: 100%;
	height: 70%;
	display: flex;


}
// .chartWithLegend{
// 		margin: auto;
// 		height: 70%;
// 		display: flex;
// }


</style>

<script>

import StackedBarChart from '@/components/charts/StackedBarChart';
import BarChart from '@/components/charts/BarChart';

import Swiper, { Navigation, Pagination } from 'swiper';

import { BIconDownload, BIconEnvelope } from 'bootstrap-vue';
import GraphCardDeck from '@/components/GraphCardDeck';
import Email from '@/components/Email';
import colors from '@/assets/js/colors';
import SbarChart from '@/components/charts/fBarChart';
import SummaryView from '../../components/Summary';
import ChartLegend from '../../components/ChartLegend';

export default {
	name       : 'entity-summary',
	components : {
		StackedBarChart,
		SummaryView,
		ChartLegend,
		BIconDownload,
		BIconEnvelope,
		BarChart,
		Email,
		SbarChart,
		GraphCardDeck
	},
	props : {
	},

	computed : {
		getSelectedContractNum() {
			return this.$store.getters.selectedContract.contractNum.toString();
		},
		EntitySummaryData() {
			return this.$store.getters.entitySummaryData;
		},
		getContractName() {
			const name = this.$store.getters.selectedContract.contractName;
			return name;
		},
	},

	methods : {
		initSwiper() {
			const self = this;
			const { swiper } = this.$refs;
			Swiper.use( [Navigation, Pagination] );
			this.swiper = new Swiper( swiper, {
				// auto initialize this swiper
				init         : true,
				initialSlide : this.activeSlide,

				// swiper settings
				slidesPerView : 1,
				direction     : 'horizontal',
				pagination    : {
					el   : '.swiper-pagination',
					type : 'bullets'
				},
				on : {
					slideChangeTransitionEnd() {
						self.activeSlide = this.activeIndex;
					}
				}
			} );
		},
		toggleEmail() {
			this.showEmail = !this.showEmail;
		},
		TotalPoundsProduced() {
		},
		InsectQuery() {

		},
		QualityQuery() {
		},
		QueryAll() {
		},
		GrabUpdatedData() {
			const data = this.$store.getters.entitySummaryData;
			return data;
		},
		getInsectDamageData() {
			const insectData = this.chartData.InsectDamage.chartData.find( item => item.year === this.InsectDamageYear );
			return ( {
				data : [{
					value    : insectData.data[0].TotalInsect,
					label    : 'All Fields',
					barColor : colors.insectColor
				}],
				userBarWidth : 70,
				options      : {
					hasBarLabels : false
				},
				title    : 'Insect Damage',
				subtitle : 'This shows the overall impact insects had on your crops this year',
				type     : 'barChart'
			} );
		},
		getAllInsectDamageData() {
			const data = this.chartData.InsectDamage.chartData.map( item => ( {
				year : item.year,
				data : [{
					value    : item.data[0].TotalInsect,
					label    : 'All Fields',
					barColor : colors.insectColor
				}],
			} ) );
			return ( {
				title         : 'Insect Damage',
				subtitle      : 'This shows the overall impact insects had on your crops this year',
				type          : 'InsectBarChart',
				multipleYears : true,
				userBarWidth  : 70,
				options       : {
					userBarWidth : 70,
					hasBarLabels : false
				},
				allData : data
			} );
		},
		getPayableYieldData() {
			const payableData = this.chartData.PayableYield.chartData.map( variety => ( {
				value      : variety.data.TotalPayable,
				label      : variety.year,
				barColor   : '#ED1C24',
				labelColor : '#ED1C24'
			} ) );
			return ( {
				data          : payableData,
				multipleYears : false,
				options       : {
					hasBarLabels : true
				},
				title    : 'Payable Yield Trends',
				subtitle : 'This shows your payable yield from the last three years'
			} );
		},
		getAllPayableYieldData() {
			const payableData = this.chartData.PayableYield.chartData.map( variety => ( {
				value      : variety.data.TotalPayable,
				label      : variety.year,
				barColor   : '#ED1C24',
				labelColor : '#ED1C24'
			} ) );
			return ( {
				allData : [{
					data : payableData
				}],
				multipleYears : false,
				options       : {
					hasBarLabels : true
				},
				title    : 'Payable Yield Trends',
				subtitle : 'This shows your payable yield from the last three years',
				type     : 'PayableBarChart'
			} );
		},
		getQualitySummaryData() {
			const qualityData = this.chartData.QualitySummary.chartData.find( item => item.year === this.QualitySummaryYear );
			let i = 0;
			const toRet = [];
			// eslint-disable-next-line no-restricted-syntax
			for ( const [key, value] of Object.entries( qualityData.data[0] ) ) {
				toRet.push( {
					label      : key,
					value,
					barColor   : colors.qualityColors[i],
					labelColor : colors.qualityColors[i++],
				} );
			}
			return ( {
				data     : toRet,
				title    : 'Quality Summary',
				subtitle : 'This is the quality of crop you produced this year'
			} );
		},
		getAllQualitySummaryData() {
			const data = this.chartData.QualitySummary.chartData.map( ( item ) => {
				const toRet = [];
				let i = 0;
				// eslint-disable-next-line no-restricted-syntax
				for ( const [key, value] of Object.entries( item.data[0] ) ) {
					toRet.push( {
						label      : key,
						value,
						barColor   : colors.qualityColors[i],
						labelColor : colors.qualityColors[i++],
					} );
				}
				return ( {

					year : item.year,
					data : toRet

				} );

			} );
			return ( {
				title    : 'Quality Summary',
				subtitle : 'This is the quality of crop you produced this year',
				options  : {
					hasBarLabels : true
				},
				allData       : data,
				type          : 'barChart',
				multipleYears : true
			} );
		}
	},

	created() {
		if ( this.EntitySummaryData.InsectDamage.chartData.length < 1 ) {
			this.$store.dispatch( 'setEntitySummaryDataInsectDamage', this.getSelectedContractNum );
		}
		if ( this.EntitySummaryData.PayableYield.chartData.length < 1 ) {
			this.$store.dispatch( 'setEntitySummaryDataPayableYield', this.getSelectedContractNum );
		}

		if ( this.EntitySummaryData.QualitySummary.chartData.length < 1 ) {
			this.$store.dispatch( 'setEntitySummaryDataQualitySummary', this.getSelectedContractNum );
		}

		this.chartData = this.GrabUpdatedData();
		this.insectChartData = this.getInsectDamageData();
		this.PayableYieldData = this.getPayableYieldData();
		this.qualitySummaryData = this.getQualitySummaryData();
		this.AllPayableYieldData = this.getAllPayableYieldData();
		this.AllInsectChartData = this.getAllInsectDamageData();
		this.AllQualitySummaryData = this.getAllQualitySummaryData();
		this.finalChartData = [this.AllPayableYieldData, this.AllQualitySummaryData, this.AllInsectChartData];
	},

	mounted() {
		this.$nextTick( () => {
			this.initSwiper();
		} );
	},

	watch : {
		InsectDamageYear() {
			this.insectChartData = this.getInsectDamageData();
		},
		QualitySummaryYear() {
			this.qualitySummaryData = this.getQualitySummaryData();
		}
	},
	// were gonna need to sync our props along with our queries when summary filters

	data : () => ( {
		totalPoundsProducedRes : null,
		insectQueryRes         : null,
		qualityQueryRes        : null,
		QualitySummaryYear     : 2018,
		InsectDamageYear       : 2018, // need to dynamically pull years and set
		cropYearArg            : 2018,
		finalChartData         : null,
		AllPayableYieldData    : null,
		AllInsectChartData     : null,
		AllQualitySummaryData  : null,
		insectChartData        : null,
		PayableYieldData       : null,
		qualitySummaryData     : null,
		options                : [
			{ value : 2018, text : '2018' },
			{ value : 2019, text : '2019' },
			{ value : 2020, text : '2020' }
		],
		swiper      : null,
		activeSlide : 0,
		showEmail   : false,
		chartData   : null
	} ),
};
</script>

<style lang="scss"scoped>
.summary-view {
	background: #f1f9f5;
	color: #026a44;
	font-family: Bitter;
	height: 88%;
}
.barhart {
	background: #CCFFCC;
}
.header {
	text-align: left;
	height: 25%;
	background: $color;
	.title {
		text-align: left;
		font-weight: bold;
		font-size: 36px;
		font-family: Bitter;
	}
	.sub-title {
		font-weight: bold;
		font-size: 24px;
		line-height: 100%;
		font-family: Bitter;
	}
}
.button-section {
	height: 10%;
	text-align: left;
	margin-top: -34px;
	margin-bottom: 20px;
}
.chart-section {
	height: 65%;
}
.btn {
	background: $color-secondary;
	box-shadow: 0px 2px 15px rgba(14, 51, 63, 0.15), 0px 2px 3px rgba(14, 51, 63, 0.15);
	border-radius: 50px;
	width: 135px;
	height: 50px;
	font-family: Manjari;
	border: none;
	font-size: 17px;
}
.btn:hover,
.btn:active,
.btn:focus {
	background: $color-primary;
}
.dark-btn{
	background: $color-primary
}
.graph-card {
	background: $color;
	border-radius: 20px;
}
.swiper-container {
	height: 95%;
}
.swiper-wrapper {
	height: 85%;
}
.chart-title {
	font-family: Manjari;
	font-style: normal;
	font-weight: bold;
	font-size: 30px;
	line-height: 30px;
	align-items: center;
	color: #5A726A;
	padding-top: 20px;
}
.chart-sub-title {
	font-family: Manjari;
	font-style: normal;
	font-weight: bold;
	font-size: 12px;
	line-height: 12px;
	align-items: center;
	color: #5A726A;
	padding-top: 0px;
}

</style>
