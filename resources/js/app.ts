import './bootstrap';
import Vue from 'vue';
import vuetify from '../plugins/vuetify';
import router from './router';
import store from './store';

import App from './components/App.vue';

Vue.component('jkevingz-app', App);

const app = new Vue({
    vuetify,
    router,
    store,
    el: '#app',
});
