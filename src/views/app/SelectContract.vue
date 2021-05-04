<template lang="pug">
	.main
		LoadingScreen(v-if='isLoading')
		.select-contract(v-else)
			h1 Select a contract
			.contracts
				.contract(v-for='contract in contracts' @click='selectContract( contract )')
					p {{ contract.contractName }} - {{ contract.contractNum }}
</template>

<script>
import { GetContractList } from '@/lib/API';
import LoadingScreen from '@/components/LoadingScreen';

export default {
	name       : 'select-contact',
	components : {
		LoadingScreen
	},
	data : () => ( {
		contracts : [],
		isLoading : false
	} ),

	created() {
		GetContractList()
			.then( ( contracts ) => {
				this.contracts = contracts;
			} );
	},

	methods : {

		async selectContract( contract ) {
			this.$store.dispatch( 'selectContract', contract );
			const args = {
				ContractNum  : contract.contractNum,
				ContractName : contract.contractName,
			};
			this.isLoading = true;
			try {
				await this.$store.dispatch( 'setEntitySummaryDataPayableYield', contract.contractNum );
				await this.$store.dispatch( 'setEntitySummaryDataInsectDamage', contract.contractNum );
				await this.$store.dispatch( 'setEntitySummaryDataQualitySummary', contract.contractNum );
				await this.$store.dispatch( 'setVarietySummaryDataPayableYield', contract.contractNum );
				await this.$store.dispatch( 'setVarietySummaryDataQualitySummary', contract.contractNum );
				await this.$store.dispatch( 'setVarietySummaryDataInsectDamage', contract.contractNum );
				await this.$store.dispatch( 'setFieldSummaryDataQualitySummary', contract.contractNum );
				await this.$store.dispatch( 'setFieldSummaryDataInsectDamage', contract.contractNum );
				this.isLoading = !this.isLoaded();
			}
			catch ( err ) {
				console.log( err );
			}
			finally {
				this.isLoading = false;
				console.log( 'done' );
				this.$router.push( { path : 'home' } );
			}


		},
		isLoaded() {
			if (	this.$store.getters.entitySummaryData.InsectDamage.chartData.length
				&& this.$store.getters.entitySummaryData.PayableYield.chartData.length
				&& this.$store.getters.entitySummaryData.QualitySummary.chartData.length
				&& this.$store.getters.varietySummaryData.InsectDamage.chartData.length
				&& this.$store.getters.varietySummaryData.PayableYield.chartData.length
				&& this.$store.getters.varietySummaryData.QualitySummary.chartData.length
				&& this.$store.getters.fieldSummaryData.InsectDamage.chartData.length
				&& this.$store.getters.fieldSummaryData.PayableYield.chartData.length
				&& this.$store.getters.fieldSummaryData.QualitySummary.chartData.length
			) return true;
			return false;
		}
	},
	computed : {
		loading() {
			if (	this.$store.getters.entitySummaryData.InsectDamage.chartData.length
				&& this.$store.getters.entitySummaryData.PayableYield.chartData.length
				&& this.$store.getters.entitySummaryData.QualitySummary.chartData.length
				&& this.$store.getters.varietySummaryData.InsectDamage.chartData.length
				&& this.$store.getters.varietySummaryData.PayableYield.chartData.length
				&& this.$store.getters.varietySummaryData.QualitySummary.chartData.length
				&& this.$store.getters.fieldSummaryData.InsectDamage.chartData.length
				&& this.$store.getters.fieldSummaryData.PayableYield.chartData.length
				&& this.$store.getters.fieldSummaryData.QualitySummary.chartData.length
			) return true;
			return false;
		}
	}


};
</script>

<style lang="scss">
	.select-contract {
		display: flex;
		flex-direction: column;
		align-items: center;

		.contracts {
			width: 90%;
			max-width: 600px;
			background-color: $bg-color;
			border-radius: 10px;
			padding: 8px 0px;

			.contract {
				padding: 8px 0px;
				cursor: pointer;

				p {
					margin : 0px;
				}

				&:hover {
					background-color: darken( $bg-color, 20 );
				}
			}
		}
	}

</style>
