<template lang="pug">
b-container.receipt(fluid v-if="!showEmail")
	b-row.header(align-v="center")
		b-col
			.back-cursor.mb-2(@click="$router.go(-1)")
				span.pr-2
					BIconChevronLeft
				span.mb-2 Back
			h2.title Grower Receipt
			h2.title Statement
			p Select the manifests you want Grower Receipt Statements for.
	b-row.body
		b-col(v-if='!lists.length')
				b-spinner(variant="success" label="Spinning")
		b-col.list-section
			b-form-group(v-for="item in lists" :key='item.fieldId')
				b-form-checkbox(
					v-model="item.allSelected",
					:indeterminate="item.indeterminate",
					@change="toggleAll($event, item.manifests)"
				)
					h4 {{ item.fieldName }}
					b-form-checkbox-group.list(
						v-model="selected",
						:options="item.manifests",
						value-field="rttNum"
						text-field="growerManifestNum"
						name="manifests",
						stacked
					)
	b-row
		b-col
	div.btn-section
		b-button-group(vertical)
			b-button.btn.dark-btn.my-2.py-2(pill @click="toggleEmail" active-class="active")
				| Email
				BIconEnvelope.ml-2
			b-button.btn.btn-receipt(pill @click='viewReceipt' active-class="active")
				| View Receipt
				BIconChevronRight.ml-2
Email(v-else :titles="selected" email-page-type="receipt" email-type="Grower Receipt Statement")
</template>

<style lang="scss" scoped>
.receipt {
	background: #f1f9f5;
	color: $color-primary;
	font-family: Manjari;
	height: 88%;
}
.header {
	font-family: Bitter;
	text-align: left;
	height: 25%;
	background: #e6f1ed;
	h2 {
		margin: 0;
	}
	p {
		margin: 10px 0px 0px 0px;
		font-family: Manjari;
	}
	.title {
		text-align: left;
		font-weight: bold;
	}
}
.body {
	height: 75%;
	text-align: left;
	overflow-y: scroll;
}
.list-section {
	padding: 20px;
	::v-deep .custom-control-label::before {
			border-radius: 30px;
			background: #E5EBB8 !important;
	}
	::v-deep .custom-control-input:checked ~ .custom-control-label::before {
	border-color: $color-primary !important;
	background-color:  $color-primary !important;
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
::v-deep .custom-control-label:before{
	border-radius: 30px;
	background: #E5EBB8 !important;

}
::v-deep .custom-checkbox .custom-control-input:checked~.custom-control-label::before{
	border-color: $color-secondary !important;
	background-color: $color-secondary !important;
}
}
.btn-section{
	position: absolute;
	bottom: 110px;
//	height: 130px;
	right: 3%;
	text-align: right;
	z-index: 10;

}
.btn {
	background: $color-secondary;
	box-shadow: 0px 2px 15px rgba(14, 51, 63, 0.15), 0px 2px 3px rgba(14, 51, 63, 0.15);
	border-radius: 50px;
	width: 120px;
	height: 40px;
	font-family: Manjari;
	border: none;
}
.btn:hover,
.btn:active,
.btn:focus {
	background: $color-primary;
}
.dark-btn{
	background: $color-primary;
	align-self: flex-end;
}
.btn-receipt{
	width: 160px;
	height: 45px;
}
@media (max-width: 360px) {
	.title {font-size:20px}
	p {font-size: 12px;}
}
@media (min-width: 375px) and (max-height: 667px) {
	 .title {font-size:20px}
	p {font-size: 12px;}
}
@media (min-width: 768px) {
	.title {font-size:30px;}
}


</style>

<script>
import { BIconChevronLeft, BIconEnvelope, BIconChevronRight } from 'bootstrap-vue';
import { GetManifests } from '@/lib/API';
import Email from '@/components/Email';

export default {
	name : 'receipt',

	components : {
		BIconChevronLeft,
		BIconEnvelope,
		BIconChevronRight,
		Email
	},

	props : {
		title : {
			type : String,
		},
	},

	data : () => ( {
		lists     : [],
		selected  : [],
		// showReceipt : false,
		showEmail : false
	} ),

	computed : {
		selectedContract() {
			return this.$store.state.selectedContract;
		}
	},

	created() {
		const { contractNum } = this.selectedContract;

		GetManifests( contractNum )
			.then( ( lists ) => {
				this.lists = lists;
			} );
	},

	watch : {
		selected( newVal ) {
			this.$nextTick( () => {
				if ( this.activeItem
				&& this.selected.length
				&& !this.activeItem.manifests.some( x => x.rttNum === newVal[newVal.length - 1] ) ) {
					// if selected other options instead of activeItem options
					// then will empty first all selected values
					this.selected = [];
				}
				const selectedItem = this.lists.find( list => list.manifests.some( x => x.rttNum === newVal[0] ) );
				if ( !selectedItem ) {
					return;
				}
				this.activeItem = selectedItem;
				this.lists = this.lists.map( ( list ) => {
					if ( !list.manifests.some( x => x.rttNum === newVal[0] ) ) {
						return {
							...list,
							allSelected   : false,
							indeterminate : false
						};
					}
					return list;
				} );

				if ( this.selected.length === 0 ) {
					selectedItem.indeterminate = false;
					selectedItem.allSelected = false;
				}
				else if ( this.selected.length === selectedItem.manifests.length ) {
					selectedItem.indeterminate = false;
					selectedItem.allSelected = true;
				}
				else {
					selectedItem.indeterminate = true;
					selectedItem.allSelected = false;
				}
			} );
		},
	},

	methods : {
		back() {
			this.$emit( 'back' );
		},
		toggleAll( checked, options ) {
			this.selected = checked ? options.map( x => x.rttNum ).slice() : [];
		},
		// toggleShowReceipt() {
		// 	this.showReceipt = !this.showReceipt;
		// },
		viewReceipt() {
			this.$store.dispatch( 'setRttNums', this.selected );
			this.$router.push( { path : 'receipt-statement' } );
		},
		toggleEmail() {
			this.showEmail = !this.showEmail;
		}
	}
};
</script>
