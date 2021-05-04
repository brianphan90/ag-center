/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';


/* eslint-disable import/no-cycle */

import router from '@/router';
import {
	GetTotalPoundsProducedAllYears,
	InsectSproc,
	QualitySproc,
	YieldByVarietySproc,
	YieldByVarietySprocAllYears,
	QualitySprocAllYears,
	QualityByFieldSprocAllYears,
	InsectSprocAllYears,
	InsectByFieldSprocAllYears,
	QualityByVarietySprocAllYears,
	InsectByVarietySprocAllYears,
	Login,
} from '@/lib/API';


Vue.use( Vuex );

export default new Vuex.Store( {
	state : {
		userInfo : {},

		navbarDisplay : true,

		accessToken       : false,
		accessTokenExpiry : false,

		contact : null,

		selectedContract : null,

		rttNums : [],

		entitySummaryData : {
			PayableYield : {
				id        : 'PayableYield',
				title     : 'Payable Yield Trends',
				subtitle  : 'This shows your payable yield from the last 5 years. ',
				chartData : [],
				type      : 'BarChart'
			},
			QualitySummary : {
				id        : 'QualitySummary',
				title     : 'Quality Summary',
				subtitle  : 'This is the quality of crop you produced this year.',
				chartData : [],
				type      : 'BarChart'
			},
			InsectDamage : {
				id        : 'InsectDamage',
				title     : 'Insect Damage',
				subtitle  : 'This shows the overall impact insects had on your crops this year.',
				chartData : [],
				type      : 'BarChartText'
			}
		},

		varietySummaryData : {
			PayableYield : {
				id        : 'PayableYield',
				title     : 'Payable Yield',
				subtitle  : 'This is the payable yield for the selected year for all varieties.',
				chartData : [],
				type      : 'BarChart'
			},
			QualitySummary : {
				id        : 'QualitySummary',
				title     : 'Quality Summary',
				subtitle  : 'This shows the quality of your crop varieties.',
				chartData : [],
				type      : 'StackedBarChart'
			},
			InsectDamage : {
				id        : 'InsectDamage',
				title     : 'Insect Damage',
				subtitle  : 'This shows the impact insects had on each variety of your crop.',
				chartData : [],
				type      : 'BarChartText'
			}
		},

		fieldSummaryData : {
			PayableYield : {
				id        : 'PayableYield',
				title     : 'Payable Yield',
				subtitle  : 'This is the payable yield for the selected for each of your fields.',
				chartData : [],
				type      : 'BarChart'
			},
			QualitySummary : {
				id        : 'QualitySummary',
				title     : 'Quality Summary',
				subtitle  : 'This shows the quality for each of your fields.',
				chartData : [],
				type      : 'StackedBarChart'
			},
			InsectDamage : {
				id        : 'InsectDamage',
				title     : 'Insect Damage',
				subtitle  : 'This shows the amount of product impacted by insect damage. ',
				chartData : [],
				type      : 'BarChartText'
			}
		},

		paymentScheduleData : {
			PaymentSchedule : {
				id        : 'PaymentSchedule',
				title     : 'Payment Schedule',
				subtitle  : 'Tap a bar on the graph to view the breakdown of Edible Kernels and Open Inshell.',
				chartData : [],
				type      : 'BarChart'
			},
			PayablevsAssessableWeight : {
				id        : 'PayablevsAssessableWeight',
				title     : 'Payable vs Assessable Weight',
				subtitle  : 'This shows the type of product that made up your payable and assessable weight.',
				chartData : [],
				type      : 'StackedBarChart'
			},
		}

	},
	getters : {
		selectedContract    : state => state.selectedContract,
		entitySummaryData   : state => state.entitySummaryData,
		varietySummaryData  : state => state.varietySummaryData,
		fieldSummaryData    : state => state.fieldSummaryData,
		paymentScheduleData : state => state.paymentScheduleData,
		contact             : state => state.contact,
	},
	mutations : {
		/* eslint-disable no-param-reassign */
		showNavbar( state ) {
			state.navbarDisplay = true;
		},
		hideNavbar( state ) {
			state.navbarDisplay = false;
		},

		setAccessToken( state, payload ) {
			state.accessToken = payload.accessToken;
			state.accessTokenExpiry = payload.accessTokenExpiry;
		},

		selectContract( state, contract ) {
			state.selectedContract = contract;
		},

		setRttNums( state, rttNums ) {
			state.rttNums = rttNums;
		},

		getContact( state, data ) {
			state.contact = data.user;
		},

		setEntitySummaryDataPayableYield( state, data ) {
			state.entitySummaryData.PayableYield.chartData = data;
		},
		setEntitySummaryDataQualitySummary( state, data ) {
			state.entitySummaryData.QualitySummary.chartData = data;
		},
		setEntitySummaryDataInsectDamage( state, data ) {
			state.entitySummaryData.InsectDamage.chartData = data;
		},
		setVarietySummaryDataPayableYield( state, data ) {
			state.varietySummaryData.PayableYield.chartData = data;
		},
		setVarietySummaryDataQualitySummary( state, data ) {
			state.varietySummaryData.QualitySummary.chartData = data;
		},
		setVarietySummaryDataInsectDamage( state, data ) {
			state.varietySummaryData.InsectDamage.chartData = data;
		},
		setFieldSummaryDataQualitySummary( state, data ) {
			state.fieldSummaryData.QualitySummary.chartData = data;
		},
		setFieldSummaryDataInsectDamage( state, data ) {
			state.fieldSummaryData.InsectDamage.chartData = data;
		},

	},
	actions : {
		showNavbar( { commit } ) {
			commit( 'showNavbar' );
		},

		hideNavbar( { commit } ) {
			commit( 'hideNavbar' );
		},

		setAccessToken( { commit }, payload ) {
			commit( 'setAccessToken', payload );
		},
		setUserStuff( { commit }, user ) {
			commit( 'setUserStuff', user );
		},

		selectContract( { commit }, contract ) {
			commit( 'selectContract', contract );
		},

		setRttNums( { commit }, rttNums ) {
			commit( 'setRttNums', rttNums );
		},

		async Login( { commit }, credentials ) {
			await Login( credentials )
				.then( ( data ) => {
					console.log( 'This is the Login Return~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' );
					console.log( data );
					commit( 'getContact', data );
					commit( 'setAccessToken', data );
					router.push( 'app' );
				} )
				.catch( ( e ) => {
					console.warn( e );
					throw e;
				} );
		},

		async setEntitySummaryDataPayableYield( { commit }, ContractNum ) {
			await GetTotalPoundsProducedAllYears( ContractNum )
				.then( ( data ) => {
					commit( 'setEntitySummaryDataPayableYield', data );
				} );
		},

		async setEntitySummaryDataQualitySummary( { commit }, ContractNum ) {

			await QualitySprocAllYears( ContractNum )
				.then( ( data ) => {
					commit( 'setEntitySummaryDataQualitySummary', data );
				} );
		},

		async setEntitySummaryDataInsectDamage( { commit }, ContractNum ) {
			await InsectSprocAllYears( ContractNum )
				.then( ( data ) => {
					commit( 'setEntitySummaryDataInsectDamage', data );
				} );
		},

		async setVarietySummaryDataPayableYield( { commit }, args ) {
			await YieldByVarietySprocAllYears( args )
				.then( ( data ) => {
					commit( 'setVarietySummaryDataPayableYield', data );
				} );
		},

		async setVarietySummaryDataQualitySummary( { commit }, args ) {
			await QualityByVarietySprocAllYears( args )
				.then( ( data ) => {
					commit( 'setVarietySummaryDataQualitySummary', data );
				} );
		},

		async setVarietySummaryDataInsectDamage( { commit }, args ) {
			await InsectByVarietySprocAllYears( args )
				.then( ( data ) => {
					commit( 'setVarietySummaryDataInsectDamage', data );
				} );
		},


		async setFieldSummaryDataQualitySummary( { commit }, args ) {
			await QualityByFieldSprocAllYears( args )
				.then( ( data ) => {
					commit( 'setFieldSummaryDataQualitySummary', data );
				} );
		},

		async setFieldSummaryDataInsectDamage( { commit }, args ) {
			await InsectByFieldSprocAllYears( args )
				.then( ( data ) => {
					commit( 'setFieldSummaryDataInsectDamage', data );
				} );
		},


	},
	modules : {
	},
} );
