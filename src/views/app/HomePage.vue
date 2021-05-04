<template lang="pug">
b-container.home-page(fluid)
  b-row.heading-row(align-v="center")
    b-col.pr-0(cols="auto")
      b-img.pointer(:src="require('../../assets/svgs/back.svg')" @click='SelectContract()')
    b-col.text-left.mt-1(cols="10")
      h6.heading.m-0 {{ contactName }}
      .pointer(@click='Logout()')
        small Sign Out
  b-row.intro-row
    b-col
      h2.heading
        b.pl-2 {{getContractName}}
      small.intro Click the button below to view and save a Grower Receipt Statement. You’ll have the option to select the manifests you want included on the report.
  b-row.download-btn-row
    b-col
      b-button.download-btn(to="/app/receipt")
        .download-icon
          BIconDownload
        .text-left Download Grower Receipt Statement
  b-row.chart-row
    b-col
      small.chart-heading.mb-4 Total Pounds Produce
      line-chart(:chart='chart_data')
</template>

<style lang="scss">
.home-page {
  font-family: Bitter;
  font-style: normal;
  color: #407765;
  background: url(("../../../public/img/home-page-background.png")) no-repeat;
  background-color: #f2f8f6;
  height: 88%;
  background-position: right 0px bottom 298px;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}
.pointer{
  cursor: pointer;
}
.heading-row {
  height: 18%;
}
.intro-row {
  height: 22%;
  text-align: left;
}
.download-btn-row {
  height: 10%;
  margin-top: -10px;
}
.chart-row {
  height: 38%;
}
.dropdown-row {
  height: 10%;
}
.heading {
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -0.03em;
}
.badge-secondary {
  background-color: #e5ebb8;
}
.intro {
  font-family: Manjari;
}
.download-btn {
  background: #ffffff;
  border-radius: 50px;
  font-family: Manjari;
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 100%;
  display: flex;
  letter-spacing: 0.03em;
  color: #407765;
  width: 220px;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(90, 114, 106, 0.3), 0px 1px 2px rgba(90, 114, 106, 0.2);    box-shadow: 0px 2px 8px rgba(90, 114, 106, 0.3), 0px 1px 2px rgba(90, 114, 106, 0.2);
  border: none;
  height: 58px;
}
.chart__wrapper {
  height: 88%;
  margin: 0 !important;
  div {
    height: 88% !important;
  }
}
.dropdown-toggle {
  background: #026a44;
  border-radius: 10px;
  font-family: Manjari;
  display: flex;
  align-items: center;
  color: #f2f8f6;
  padding: 5px 15px 6px 15px;
}
.dropdown-toggle:hover,
.dropdown-toggle:active,
.dropdown-toggle:focus {
  background: #fff !important;
  color: #026a44 !important;
}
.download-btn:hover,
.download-btn:focus,
.download-btn:active {
  color: #fff !important;
  background: #026a44 !important;
}
.b-dropdown {
  ul {
    background-color: #026a44;
    border-radius: 10px;
    li {
      a {
        color: #fff;
        font-family: Manjari;
        font-size: 15px;
      }
    }
  }
}
.chart-heading {
  float: right;
  padding-right: 14px;
  font-family: Bitter;
  font-style: normal;
  font-weight: 700;
  color: #5a726a;
}
.dropdown-custom {
  padding-right: 60px;
}
.download-icon {
  font-size: 18px;
  font-weight: bold;
  padding: 0px 20px 0 10px;
}
</style>

<script>
// import { D3LineChart } from 'vue-d3-charts';

import LineChart from '@/components/charts/LineChart';
import { BIconDownload } from 'bootstrap-vue';
import colors from '@/assets/js/colors';
import { SetLogout } from '@/lib/API';
import Receipt from './Receipt';

export default {
	name       : 'HomePage',
	components : {
		LineChart,
		BIconDownload,
		Receipt,
	},
	data : () => ( {
		chart_data : {
			label     : 'Pounds Produced',
			updatedAt : new Date(),
		},
	} ),
	created() {
		// eslint-disable-next-line no-unused-vars
		const args = {
			ContractNum : this.getSelectedContractNum,
			CropYear    : this.cropYearArg
		};
		this.chart_data.data = this.payableYieldData;
	},
	computed : {
		payableYieldData() {
			const chartData = this.$store.getters.entitySummaryData;
			console.log( chartData );
			const payableData = chartData.PayableYield.chartData.map( ( variety, i ) => ( {
				value : variety.data.TotalPayable,
				label : variety.year,
				color : colors.lineColors[i],
			} ) );
			return payableData;
		},
		getSelectedContractNum() {
			return this.$store.getters.selectedContract.contractNum.toString();
		},
		getContractName() {
			const name = this.$store.getters.selectedContract.contractName;
			return name;
		},
		userName() {
			const user = this.$store.getters.userInfo;
			const fullName = `${user.firstName.trim()} ${user.lastName.trim()}`;
			return fullName;
		},

		getEntitySummaryData() {
			return this.$store.getters.entitySummaryData;
		},
		contactName() {
			return `${this.$store.getters.contact.firstName.trim()} ${this.$store.getters.contact.lastName.trim()}`;
		}
	},
	methods : {
		Logout() {
			this.$store.dispatch( 'destroyAccessToken' );
			SetLogout();
			console.log( 'SetLogout' );
			this.$router.push( '/' );
		},
		SelectContract() {
			this.$router.push( '/app/select-contract' );
		}
	}
};
</script>
