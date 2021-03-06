import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App';
import router from './router';
import store from './store';

// Install BootstrapVue
Vue.use( BootstrapVue );

Vue.config.productionTip = false;

new Vue( {
	router,
	store,
	render : h => h( App )
} ).$mount( '#app' );
