<template lang="pug">
	b-container.summary-view(fluid v-if="!showEmail")
		b-row.header(align-v="center")
			b-col
				h1.title Variety Summary
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
.entity-summary{
	height: 88%;
}
</style>

<script>
import BarChart from '@/components/charts/BarChart';
import StackedBarChart from '@/components/charts/StackedBarChart';
import colors from '@/assets/js/colors';
import Swiper, { Navigation, Pagination } from 'swiper';
import SbarChart from '@/components/charts/fBarChart';
import { BIconDownload, BIconEnvelope } from 'bootstrap-vue';
import GraphCardDeck from '@/components/GraphCardDeck';
import Email from '@/components/Email';


export default {
	name       : 'variety-summary',
	components : {
		BIconDownload,
		BIconEnvelope,
		BarChart,
		Email,
		StackedBarChart,
		SbarChart,
		GraphCardDeck
	},

	computed : {
		getSelectedContractNum() {
			return this.$store.getters.selectedContract.contractNum.toString();
		},
		getVarietySummaryData() {
			return this.$store.getters.varietySummaryData;
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
			const data = this.$store.getters.varietySummaryData;
			return data;
		},
		// getQualitySummary(){

		// },
		getPayableYieldData() {
			const yields = this.chartData.PayableYield.chartData.map( ( item ) => {
				const data = item.data.map( v => ( {
					value      : v.TotalPayable,
					label      : v.Variety,
					barColor   : colors.colorSecondary,
					labelColor : colors.colorSecondary
				} ) );
				return {
					year : item.year,
					data
				};
			} );
			return ( {
				allData : yields,
				options : {
					hasBarLabels : true
				},
				multipleYears : true,
				title         : 'Payable Yield',
				subtitle      : 'This is the payable yield for the selected years for all the variety',
				type          : 'barChart'
			} );
		},
		getQualitySummaryData() {
			// missing sprocs to retrieve data
			const qs = this.chartData.QualitySummary;
			const toRet = qs.chartData.map( ( item ) => {
				const data = item.data.map( d => ( {
					values : {
						CSEdible         : d.CSEdible,
						NetShellingStock : d.NetShellingStock,
						NetSplitInshell  : d.NetSplitInshell

					},
					label : `Field ${d.Variety}`,
				} ) );
				return ( {
					data,
					year : item.year
				} );
			} );
			return ( {
				title    : qs.title,
				subtitle : qs.subtitle,
				options  : {
					hasBarLabels : false
				},
				type          : 'stackedBarChart',
				multipleYears : true,
				allData       : toRet,
				legend        : {
					CSEdible : {
						color : '#E5BF11',
						label : 'Closed Shell',
						order : 1
					},
					NetShellingStock : {
						color : '#F8A79E',
						label : 'Shelling Stock',
						order : 3
					},
					NetSplitInshell : {
						color : '#89B831',
						label : 'Split InShell',
						order : 2
					}
				}
			} );
		},
		getInsectDamageData() {
			const id = this.chartData.InsectDamage;
			const yields = id.chartData.map( ( item ) => {
				const data = item.data.map( v => ( {
					value      : v.Insect,
					label      : v.Variety,
					barColor   : '#E8C528',
					labelColor : '#E8C528'
				} ) );
				return {
					year : item.year,
					data
				};
			} );
			return ( {
				allData : yields,
				options : {
					hasBarLabels : true
				},
				multipleYears : true,
				title         : id.title,
				subtitle      : id.subtitle,
				type          : 'barChart'
			} );
		},
	},

	created() {
		/*
		const args = {
			ContractNum : this.getSelectedContractNum,
			CropYear    : this.cropYearArg
		};
		this.$store.dispatch( 'setEntitySummaryDataPayableYield', this.getSelectedContractNum );
		this.$store.dispatch( 'setEntitySummaryDataQualitySummary', args );
		this.$store.dispatch( 'setEntitySummaryDataInsectDamage', args );
		*/
		const args = {
			ContractNum : this.getSelectedContractNum,
			CropYear    : this.cropYearArg
		};
		// if ( this.getVarietySummaryData.PayableYield.chartData.length < 1 ) {
		// 	this.$store.dispatch( 'setVarietySummaryDataPayableYield', args );
		// }
		this.chartData = this.GrabUpdatedData();
		this.PayableYieldData = this.getPayableYieldData();
		this.InsectDamage = this.getInsectDamageData();
		this.QualitySummary = this.getQualitySummaryData();
		this.finalChartData = [this.PayableYieldData, this.InsectDamage, this.QualitySummary];
	},

	mounted() {
		this.$nextTick( () => {
			this.initSwiper();
		} );
	},
	watch : {
		PayableYieldYear() {
			this.PayableYieldData = this.getPayableYieldData();
		}
	},
	// were gonna need to sync our props along with our queries when summary filters

	data : () => ( {
		totalPoundsProducedRes : null,
		insectQueryRes         : null,
		qualityQueryRes        : null,
		PayableYieldYear       : 2018,
		QualitySummary         : '',
		InsectDamage           : '',
		cropYearArg            : '2020',
		chartData              : null,
		PayableYieldData       : null,
		finalChartData         : null,
		options                : [
			{ value : 2018, text : '2018' },
			{ value : 2019, text : '2019' },
			{ value : 2020, text : '2020' }
		],
		swiper      : null,
		activeSlide : 0,
		showEmail   : false,
	} ),
};
</script>

<style lang="scss"scoped>
.barChart{
	margin:auto;
	width: 100%;
	height: 70%;
	display: flex;


}
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
