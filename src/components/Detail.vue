<template lang="pug">
b-container.detail(fluid)
	b-row.header(align-v="center")
		b-col
			h2.title Manifest #31234
			h5.sub-title {{getContractName}}
	b-row.info-section
		b-col
			b-row
				b-col.text-left
					h6.info-title General Info
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Grower
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item B&B Walker
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Field #
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item 30n
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Processor
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item Zach Raven
			b-row.button-section(align-v="center")
				b-col.text-left
					b-button.btn
						span.pr-2.align-middle
							b-img(:src="require('../assets/svgs/phone.svg')")
						| (559) 123-4567

	b-row.info-section
		b-col
			b-row
				b-col.text-left
					h6.info-title Delivery Info
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Received
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item 09/24/19 12:54 PM
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Processed
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item 09/24/19 5:07pm
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Front Temp
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item 78º F
			b-row
				b-col.pr-0(cols='auto')
					span.list-item Rear Temp
				b-col.p-0
					div.dotted
				b-col.pl-0(cols='auto')
					span.list-item 78º F
			b-row.button-section(align-v="center")
				b-col.text-left
					b-button.btn
						span.pr-2.align-middle
							b-img(:src="require('../assets/svgs/phone.svg')")
						| (559) 123-4567
	b-row.footer
		b-col(@click='back')
			b-row
				b-col
					BIconChevronUp
			b-row
				b-col
					h2 Hide Details
</template>

<style lang="scss" scoped>
.detail {
	font-family: Manjari;
	height: 88%;
	background: linear-gradient(180deg, #E6F1ED 0%, #FFFFFF 100%);
	box-shadow: 0px 2px 5px rgba(80, 96, 110, 0.1), 0px 4px 34px rgba(80, 96, 110, 0.15);
}
.header {
	text-align: left;
	height: 20%;
	.title {
		text-align: left;
		font-weight: bold;
		font-family: Bitter;
	}
	.sub-title {
		font-weight: bold;
		line-height: 100%;
		font-family: Bitter;
	}
}
.info-section{
	height: 32%;
	.info-title{
		font-family: Bitter;
    font-weight: bold;
    line-height: 100%;
    color: #50606E;
	}
}
.list-item{
font-family: Manjari;
font-style: normal;
font-weight: normal;
font-size: 18px;
line-height: 100%;
color: #5A726A;

}
.left,.right{
    float:right;
}
.left{
    float:left;
    clear:both;
}
.dotted{
	border: 1px dashed rgba(90, 114, 106, 0.46);
  margin-top:14px;
}
.btn {
	background: $color-primary;
	box-shadow: 0px 2px 15px rgba(14, 51, 63, 0.15), 0px 2px 3px rgba(14, 51, 63, 0.15);
	border-radius: 50px;
	width: 190px;
	height: 45px;
	border: none;
	margin: 5px;
}
.footer{
	height: 16%;
	cursor: pointer;
	align-items: flex-end;
	color: #5A726A;
	letter-spacing: 0.05em;
}
</style>

<script>
import { BIconChevronUp } from 'bootstrap-vue';

export default {
	name       : 'detail',
	components : {
		BIconChevronUp
	},
	props : {
		title : {
			type : String,
		},
	},
	computed : {
		getContractName() {
			const name = this.$store.getters.selectedContract.contractName;
			return name;
		},
	},
	methods : {
		back() {
			this.$emit( 'back' );
		},
	},
	data : () => ( {
	} )
};
</script>
