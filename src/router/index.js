import Vue from 'vue';
import VueRouter from 'vue-router';
import { RefreshToken } from '@/lib/API';
import Home from '../views/app/Home';
import Store from '../store';


Vue.use( VueRouter );

const routes = [
	{
		path      : '/',
		name      : 'Login',
		component : () => import( '../views/Login' )
	},
	{
		path      : '/app',
		name      : 'Home',
		component : Home,
		redirect  : '/app/select-contract',
		children  : [
			{
				path      : 'select-contract',
				name      : 'Select Contract',
				component : () => import( '@/views/app/SelectContract' )
			},
			{
				path      : 'home',
				name      : 'HomePage',
				component : () => import( '@/views/app/HomePage' )
			},
			{
				path      : 'entity-summary',
				name      : 'Entity Summary',
				component : () => import( '../views/app/EntitySummary' )
			},
			{
				path      : 'variety-summary',
				name      : 'Variety Summary',
				component : () => import( '../views/app/VarietySummary' )
			},
			{
				path      : 'field-summary',
				name      : 'Field Summary',
				component : () => import( '../views/app/FieldSummary' )
			},
			{
				path      : 'payment',
				name      : 'Payment Schedule',
				component : () => import( '../views/app/PaymentSchedule' )
			},
			// {
			// 	path      : 'email',
			// 	name      : 'Email',
			// 	component : () => import( '../views/app/Email' )
			// },
			{
				path      : 'receipt',
				name      : 'Receipt',
				component : () => import( '../views/app/Receipt' )
			},
			{
				path      : 'receipt-statement',
				name      : 'Receipt Statement',
				component : () => import( '../views/app/ReceiptStatement' )
			},
		],
		beforeEnter : ( to, from, next ) => {
			const { accessToken } = Store.state;

			if ( accessToken ) {
				next();
			}

			RefreshToken()
				.then( ( data ) => {
					console.log( data );
					if ( !data.accessToken ) {
						next( '/' );
					}
					Store.dispatch( 'setAccessToken', data );
					next();
				} )
				.catch( ( e ) => {
					console.warn( e );
					next( '/' );
				} );


		}
	}
];

const router = new VueRouter( {
	mode : 'history',
	base : process.env.BASE_URL,
	routes
} );

export default router;
