<template lang="pug">
b-container.receipt(fluid v-if="!showEmail" :class='fullScreen ? "full-screen-dislay" : ""')
	b-row.header(align-v="center" :class='fullScreen ? "d-none" : ""')
		b-col.h-100

			b-row.first-section
				b-col
					.back-cursor.mb-2(@click="$router.go(-1)")
						span.pr-2.float-left
							BIconChevronLeft
						span.mb-2.float-left Back
						span.float-right(@click.stop='toggleFullScreen')
							b-img(:src="require('../../assets/svgs/expand.svg')")
			b-row.second-section(v-if='!showDetail')
				b-col
					.swiper-container(ref='swiper')
							//- .swiper-pagination
							.swiper-wrapper
								.swiper-slide(v-for='summaryTable in summaryTables') Grower Manifest : {{ selectedContract }}
			b-row.third-section
				b-col
					h2.title Grower Receipt
					h2.title Statement
			//- b-row.fourth-section
			//- 	b-col
			//- 		button.btn-show-detail(@click='toggleShowDetail')
			//- 			span.pr-2
			//- 				BIconChevronDown
			//- 			| Show details
			b-row.fourth-section
				b-col
					b-dropdown(text="Select A Contract")
						template(#button-content) {{ selectedContract ? `Manifest # ${selectedContract}` : "Select a Contract"}}
						b-dropdown-item(
							v-for="(summary,i) in summaryTables"
							:key="summary.meta.growerManifestNum"
							:value="summary.meta.growerManifestNum"
							@click="onSelectContract(i,summary.meta.growerManifestNum)") {{summary.meta.growerManifestNum}} Rtt# {{summary.meta.rttNum}}
	b-row.body(:class='fullScreen ? "full-screen-dislay" : ""')
		b-col.load-analysis-table.p-0(cols="5")
			b-table.table(
				responsive,
				:items="activeSummaryTableLabels",
				:fields="load_analysis_headers"
			)

		b-col.p-0(cols="7")
			b-table(responsive, :items="activeSummaryTable.summaryTable", :fields="statistic_headers")
	b-row
		b-col
	div.btn-section(v-if='!showDetail' :class='fullScreen ? "d-none" : ""')
		b-button-group(vertical)
			b-button.dark-btn(v-if='!showOptions' pill @click="toggleShowDetail")
				div.my-1
					BIconClipboardData.mr-2
					| Report
			b-button.dark-btn(v-if='!showOptions' pill @click="toggleEmail" active-class="active" )
				div.my-1
					BIconEnvelope.mr-2
					| Email
			b-button.dark-btn(v-if='!showOptions' pill)
				div.my-1
					BIconDownload.mr-2
					| Save
			b-button.fab-button.rounded-circle(@click='toggleActionButtons' active-class="active")
				BIconX(v-if='!showOptions')
				BIconThreeDots(v-else)
	span.float-right.full-screen-toggle(v-if='fullScreen' @click.stop='toggleFullScreen')
		b-img(:src="require('../../assets/svgs/expand.svg')")

	detail(@back='toggleShowDetail' class="slideup" :class='showDetail ? "slidedown" : "slideup"')
Email(v-else :titles="summaryTables" email-page-type="receipt" email-type="Grower Receipt Statement")
</template>

<style lang="scss" scoped>

.dropdown-menu {
	li{
		.button{
			color : #fff;
		}

	}
}

.receipt {
	background: #f1f9f5;
	color: $color-primary;
	font-family: Manjari;
	height: 88%;
}
.header {
	font-family: Bitter;
	text-align: center;
	height: 30%;
	background: $color;
	h1 {
		margin: 0;
	}
	p {
		margin: 10px 0px 0px 0px;
		font-family: Manjari;
	}
	.title {
		text-align: center;
		display: table;
		width: 100%;
		font-weight: bold;
		margin: 0;
		line-height: 100%;
	}
	.first-section{
		height: 17%;
    margin-top: 5px;
	}
	.second-section{
		height: 23%;
	}
	.third-section{
		height: 35%;
	}
	.fourth-section{
		height: 25%;
	}
		.fifth-section{
		height : 25%
	}
}
.body {
	background: $color;
  height: 70%;
  text-align: left;
  overflow-y: scroll;
	.load-analysis-table{
		box-shadow: 0px 2px 4px rgba(90, 110, 114, 0.21), 0px 6px 14px rgba(90, 110, 114, 0.2);
	}
  ::v-deep .table {
    td {
      font-family: Manjari;
      font-style: normal;
      font-weight: bold;
      font-size: 13px;
      line-height: 15px;
      color: #5a726a;
			vertical-align: middle !important;
			height: 55px !important;
    }
		th {
		background: #f1f9f5 !important;
		color: #5A726A;
		border-top: 1px solid #dee2e6;
    border-bottom: none !important;
    height: 54px;
    font-weight: normal;
    font-size: 13px;
    line-height: 14px;
    vertical-align: middle !important;
		}
  }
}
.list-section {
	padding: 20px;
	::v-deep .custom-control-label::before {
		border-radius: 30px;
		background: #e5ebb8 !important;
	}
	::v-deep .custom-control-input:checked ~ .custom-control-label::before {
		border-color: $color-primary !important;
		background-color: $color-primary !important;
	}
}
.back-cursor {
	cursor: pointer;
	font-family: Manjari;
	font-weight: bold;
	font-size: 13px;
}


.list {
	color: $color-secondary;
	letter-spacing: 0.005em;
	.custom-control {
		padding-bottom: 10px;
	}
	::v-deep .custom-control-label:before {
		border-radius: 30px;
		background: #e5ebb8 !important;
	}
	::v-deep
		.custom-checkbox
		.custom-control-input:checked
		~ .custom-control-label::before {
		border-color: $color-secondary !important;
		background-color: $color-secondary !important;
	}
}
.btn-section {
  position: absolute;
  bottom: 13%;
  margin-right: 4em;
  text-align: right;
  z-index: 10;
	left: 0;
	right: 0;
}
.btn {
	background: $color-secondary;
	box-shadow: 0px 2px 15px rgba(14, 51, 63, 0.15), 0px 2px 3px rgba(14, 51, 63, 0.15);
	width: 120px;
	font-family: Manjari;
	border: none;
	margin: 5px;
}
.btn-show-detail {
	width: 191px;
	height: 80%;
	background: #ffffff;
	box-shadow: 0px 2px 4px rgba(90, 110, 114, 0.21),
		0px 6px 14px rgba(90, 110, 114, 0.2);
	border-radius: 33px;
	border: none;
	font-family: Manjari;
	letter-spacing: 0.05em;
	color: #5A726A;
}
.btn-show-detail:hover,
.btn-show-detail:active,
.btn-show-detail:focus {
 border: none;
 outline: none;
}
.fab-button{
	width: 50px;
	height: 50px;
	padding: 7px 10px;
	margin-left: 4.75em

}
.dark-btn {
	background: $color-primary;
}
.full-screen-dislay{
	height: 100%;
}
.full-screen-toggle{
	position: absolute;
  top: 7px;
	padding: 4px;
  right: 7px;
	background: #fff;
	border-radius: 7px;
	  box-shadow: 0px 2px 8px rgba(90, 114, 106, 0.3),
    0px 1px 2px rgba(90, 114, 106, 0.2);
}

.slideup, .slidedown {
	left: 0;
	overflow-y: hidden;
	top: -88%;
  position: absolute;
  -webkit-transition: top 0.3s ease-in-out;
  -moz-transition: top 0.3s ease-in-out;
  -o-transition: top 0.3s ease-in-out;
  transition: top 0.3s ease-in-out;
  }
.slidedown {
	top : 0;
	position: absolute;
	}

@media (max-width: 360px) {
  .title {font-size:20px}
}
@media (min-width: 375px) and (max-height: 667px) {
   .title {font-size:20px}
}
@media (min-width: 768px) {
  .title {font-size:30px;}
}

.swiper-container{
	height: 100%;
	.swiper-pagination{
		bottom: 55% !important;
		::v-deep .swiper-pagination-bullet-active{
			background: $color-primary !important;
		}
	}
	.swiper-wrapper{
		top: 55%;
	}
	.swiper-button-prev,
	.swiper-button-next{
		top: auto !important;
		background: none !important;
	}
	.swiper-slide{
		font-size: 14px;
    color: #5A726A;

	}
}
</style>

<script>
import {
	BIconThreeDots,
	BIconChevronLeft,
	BIconEnvelope,
	BIconChevronRight,
	BIconChevronDown,
	BIconDownload,
	BIconX,
	BIconClipboardData
} from 'bootstrap-vue';
import Swiper, { Navigation, Pagination } from 'swiper';

import { GetSummaryTable } from '@/lib/API';

import Email from '@/components/Email';

import Detail from '../../components/Detail';

export default {
	name : 'receipt-statement',

	components : {
		BIconThreeDots,
		BIconChevronLeft,
		BIconEnvelope,
		BIconChevronRight,
		BIconChevronDown,
		BIconDownload,
		Detail,
		Email,
		BIconX,
		BIconClipboardData
	},

	created() {
		GetSummaryTable( this.rttNums )
			.then( ( summaryTables ) => {
				this.summaryTables = summaryTables;
				this.selectedContract = summaryTables[0].meta.growerManifestNum;
			} );
	},

	watch : {
		summaryTables( summaryTables ) {
			if ( !summaryTables.length ) {
				return;
			}

			this.$nextTick( () => {
				this.initSwiper();
			} );
		}
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
						  // Navigation arrows
				navigation : {
					nextEl : '.swiper-button-next',
					prevEl : '.swiper-button-prev',
				},
				on : {
					slideChangeTransitionEnd() {
						self.activeSlide = this.activeIndex;
						console.log( self.activeSlide );
					}
				}
			} );
		},
		toggleAll( checked, options ) {
			this.selected = checked ? options.slice() : [];
		},
		toggleFullScreen() {
			this.fullScreen = !this.fullScreen;
			if ( this.fullScreen ) {
				this.$store.dispatch( 'hideNavbar' );
			}
			else {
				this.$store.dispatch( 'showNavbar' );
			}
		},
		toggleShowDetail() {
			this.showDetail = !this.showDetail;
		},
		toggleEmail() {
			this.showEmail = !this.showEmail;
		},
		toggleActionButtons() {
			this.showOptions = !this.showOptions;
		},
		onSelectContract( index, contract ) {
			this.activeSlide = index;
			this.selectedContract = contract;
		},
		testing() {
			console.log( 'testing' );
		}
	},

	data() {
		return {
			showOptions           : false,
			showDetail            : false,
			fullScreen            : false,
			swiper                : null,
			activeSlide           : 0,
			load_analysis_headers : [{ key : 'label', label : 'Load Analysis' }],
			load_analysis_data    : [
				{ load_analysis : 'Gross Weight' },
				{ load_analysis : 'Less: Tore' },
				{ load_analysis : 'Gross Green Weight' },
				{ load_analysis : 'Less: Trash' },
				{ load_analysis : 'Net Green Weight' },
				{ load_analysis : 'Weight After Hulling' },
				{ load_analysis : 'Weight After drying to 3.1%' },
				{ load_analysis : 'Weight After Adjusting to 5%' },
				{ load_analysis : 'TOTAL DRY LOAD' },
				{ load_analysis : 'load_analysis value 10' },
				{ load_analysis : 'load_analysis value 11' },
				{ load_analysis : 'load_analysis value 12' },
			],
			statistic_headers : [
				{ key : 'totalPounds', label : 'Total Pounds' },
				{ key : 'assessableWeight', label : 'Assessable Weight' },
				{ key : 'payableWeight', label : 'Payable Weight' },
				{ key : 'assessableNGW', label : 'Assessable Net Gross Weight' },
				{ key : 'payableNGW', label : 'Payable Net Gross Weight' },
				{ key : 'assessableGrams', label : 'Assessable Grams' },
				{ key : 'payableGrams', label : 'Payable Grams' },
				{ key : 'assessablePct', label : 'Assessable Percentage' },
				{ key : 'payablePct', label : 'Payable Percentage' },
			],
			showEmail        : false,
			summaryTables    : [],
			selectedContract : null
		};
	},

	computed : {
		rttNums() {
			return this.$store.state.rttNums;
		},

		activeSummaryTable() {
			const { activeSlide } = this;

			const activeSummaryTable = this.summaryTables[activeSlide];

			if ( !activeSummaryTable ) {
				return {};
			}

			return activeSummaryTable;
		},

		activeSummaryTableLabels() {
			const { activeSummaryTable } = this;
			const { summaryTable } = activeSummaryTable;

			if ( !summaryTable ) {
				return [];
			}

			return summaryTable.map( d => ( { label : d.label } ) );
		}
	}
};
</script>
