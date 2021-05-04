<template lang="pug">
	b-container.summary-view(fluid v-if="!showEmail")
		b-row.header(align-v="center")
			b-col
				h1.title Payment Schedule
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
				.swiper-container(ref='swiper')
					.swiper-wrapper
						//-	will use slots here for re usable graphs
						.swiper-slide.graph-card
							h4.chart-title {{chartData.PaymentSchedule.title}}
							h5.chart-sub-title {{chartData.PaymentSchedule.subtitle}}
							b-form-select(v-model='PayableYield' :options="options")
						.swiper-slide.graph-card
							h4.chart-title {{chartData.PayablevsAssessableWeight.title}}
							h5.chart-sub-title {{chartData.PayablevsAssessableWeight.subtitle}}
							b-form-select(v-model='QualitySummary' :options="options")
					.swiper-pagination
	Email(v-else :only-title="this.$route.name" email-page-type="summary" :email-type="this.$route.name")
</template>

<style lang="scss" scoped>
.entity-summary{
	height: 88%;
}
</style>

<script>
import BarChart from '@/components/charts/BarChart';

import Swiper, { Navigation, Pagination } from 'swiper';

import { BIconDownload, BIconEnvelope } from 'bootstrap-vue';

import Email from '@/components/Email';


export default {
	name       : 'field-summary',
	components : {
		BIconDownload,
		BIconEnvelope,
		BarChart,
		Email
	},

	computed : {
		getSelectedContractNum() {
			return this.$store.getters.selectedContract.contractNum.toString();
		},
		getVarietySummaryData() {
			return this.$store.getters.paymentScheduleData;
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
			const data = this.$store.getters.paymentScheduleData;
			return data;
		}
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
	},

	mounted() {
		this.$nextTick( () => {
			this.initSwiper();
		} );
	},

	// were gonna need to sync our props along with our queries when summary filters

	data : () => ( {
		totalPoundsProducedRes : null,
		insectQueryRes         : null,
		qualityQueryRes        : null,
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
