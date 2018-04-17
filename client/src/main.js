// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import FlagIcon from 'vue-flag-icon';
import 'vuetify/dist/vuetify.min.css';
import moment from 'moment';
import AxiosPlugin from './plugins/axios.js';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'mdi/css/materialdesignicons.css';

Vue.use(FlagIcon);
Vue.use(Vuetify);
Vue.use(AxiosPlugin);
Vue.config.silent = true;
Vue.filter('formatDate', function(value) {
	if (value) {
		return moment(String(value)).format('YYYY-MM-DD');
	}
});
Vue.config.productionTip = false;

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});
