import Vue from 'vue';
import App from './App.vue';
import store from './store';
import axios from 'axios';

axios.defaults.baseURL = 'http://0.0.0.0:81/';
axios.defaults.headers.common = {
  Accept: 'application/json',
};

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
