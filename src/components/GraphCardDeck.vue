<template lang="pug">
.GraphCardDeck.swiper-container(ref='swiper')
    .swiper-wrapper
        GraphCard.swiper-slide(
			v-for='chart in chartData'
			:chartTitle='chart.title'
			:id='chart.id'
			:title="chart.title"
			:subTitle="chart.subtitle"
			:chartData="chart.allData"
			:options = "chart.options"
			:chartType="chart.type"
			:multipleYears = "chart.multipleYears"
			:legend = "chart.legend"
		)
    .swiper-pagination
</template>

<script>
//	eslint-disable
import Swiper, { Navigation, Pagination } from 'swiper';

import GraphCard from '@/components/GraphCard';

export default {
	name       : 'GraphCardDeck',
	components : {
		GraphCard,
	},
	props : {
		chartData : {
			type : Array,
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
				slidesPerView  : 1,
				direction      : 'horizontal',
				spaceBetween   : 30,
				centeredSlides : true,
				pagination     : {
					el   : '.swiper-pagination',
					type : 'bullets'
				},
				on : {
					slideChangeTransitionEnd() {
						self.activeSlide = this.activeIndex;
					}
				}
			} );
		}
	},
	mounted() {
		console.log( 'Mounted GraphCarDDeck' );
		this.$nextTick( () => {
			this.initSwiper();
		} );
	},
	data : () => ( {
		swiper      : null,
		activeSlide : 0,
	} ),
};
</script>

<style lang="scss">
.swiper-container{
	height: 95%;
	.swiper-pagination .swiper-pagination-bullet-active{
		background: $color-primary !important;
	}
	.swiper-wrapper{
		height: 85%;
		.swipper-slide {
			max-width: none !important;
		}
	}
}
</style>
