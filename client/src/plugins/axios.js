import axios from 'axios';

export default {
	install: function (Vue, name = '$http') {
		var service_url = process.env.SERVICE_URL;
		axios.defaults.baseURL = service_url;

		Vue.prototype[name] = axios;

		Vue.prototype[name].updateToken = token => {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		};
	}
};
