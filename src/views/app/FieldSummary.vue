<template lang="pug">
	b-container.summary-view(fluid v-if="!showEmail")
		b-row.header(align-v="center")
			b-col
				h1.title Field Summary
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
				//- .swiper-container(ref='swiper')
				//- 	.swiper-wrapper
				//- 		//-	will use slots here for re usable graphs
				//- 		.swiper-slide.graph-card
				//- 			h4.chart-title {{chartData.PayableYield.title}}
				//- 			h5.chart-sub-title {{chartData.PayableYield.subtitle}}
				//- 			SimpleBarChart
				//- 		.swiper-slide.graph-card
				//- 			h4.chart-title {{chartData.QualitySummary.title}}
				//- 			h5.chart-sub-title {{chartData.QualitySummary.subtitle}}
				//- 			StackedBarChart
				//- 			b-form-select(v-model='QualitySummary' :options="options")
				//- 		.swiper-slide.graph-card
				//- 			h4.chart-title {{chartData.InsectDamage.title}}
				//- 			h5.chart-sub-title {{chartData.InsectDamage.subtitle}}
				//- 			BarChart
				//- 			b-form-select(v-model='InsectDamage' :options="options")
				//- 	.swiper-pagination
				GraphCardDeck(:chartData='finalData')

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
import SimpleBarChart from '@/components/charts/fBarChart';
import GraphCardDeck from '@/components/GraphCardDeck';
import Swiper, { Navigation, Pagination } from 'swiper';

import { BIconDownload, BIconEnvelope } from 'bootstrap-vue';

import Email from '@/components/Email';


export default {
	name       : 'field-summary',
	components : {
		BIconDownload,
		BIconEnvelope,
		BarChart,
		Email,
		StackedBarChart,
		SimpleBarChart,
		GraphCardDeck
	},

	computed : {
		getSelectedContractNum() {
			return this.$store.getters.selectedContract.contractNum.toString();
		},
		getVarietySummaryData() {
			return this.$store.getters.fieldSummaryData;
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
			const data = this.$store.getters.fieldSummaryData;
			return data;
		},
		getInsectDamageData() {
			const toRet = this.chartData.InsectDamage.chartData.map( ( item ) => {
				const data = item.data.map( d => ( {
					label      : `Field ${d.FieldName}`,
					value      : d.Insect,
					barColor   : '#E5BF11',
					labelColor : '#E8C528'
				} ) );
				return ( {
					year : item.year,
					data,
				} );
			} );
			return {
				allData  : toRet,
				title    : 'Insect Damage',
				subtitle : 'This shows the amount of product impacted by insect damage',
				options  : {
					hasBarLabels : true
				},
				type          : 'barChart',
				multipleYears : true
			};
		},
		getQualitySummaryData() {
			const qs = this.chartData.QualitySummary;
			const toRet = qs.chartData.map( ( item ) => {
				const data = item.data.map( d => ( {
					values : {
						CSEdible         : d.CSEdible,
						NetShellingStock : d.NetShellingStock,
						NetSplitInshell  : d.NetSplitInshell

					},
					label : `Field ${d.FieldName}`,
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
		this.chartData = this.GrabUpdatedData();
		this.insectData = this.getInsectDamageData();
		this.qualityData = this.getQualitySummaryData();
		this.finalData = [this.insectData, this.qualityData];
	},

	mounted() {
		this.$nextTick( () => {
			this.initSwiper();
		} );
	},

	// were gonna need to sync our props along with our queries when summary filters

	data : () => ( {
		chartData              : null,
		totalPoundsProducedRes : null,
		insectQueryRes         : null,
		qualityQueryRes        : null,
		insectData             : null,
		qualityData            : null,
		finalData              : null,
		PayableYield           : '',
		QualitySummary         : '',
		InsectDamage           : '',
		cropYearArg            : '2020',
		options                : [
			{ value : '2017', text : '2017' },
			{ value : '2018', text : '2018' },
			{ value : '2019', text : '2019' },
			{ value : '2020', text : '2020' }
		],
		swiper      : null,
		activeSlide : 0,
		showEmail   : false,
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
