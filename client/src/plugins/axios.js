import axios from 'axios';

export default {
	install: function (Vue, name = '$http') {
		axios.defaults.baseURL = 'https://rocsafe.inov.pt';

		Vue.prototype[name] = axios;

		Vue.prototype[name].updateToken = token => {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		};
	}
};
