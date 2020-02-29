import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../components/pages/store/Store.vue';
import Cart from '../components/pages/cart/Cart.vue';

Vue.use(VueRouter);

const routes = [
    {
        component: Store,
        name: 'store',
        path: '/store',
    },
    {
        component: Cart,
        name: 'cart',
        path: '/cart',
    },
    {
       path: '**', 
       redirect: '/store',
    },
];

export default new VueRouter({
    routes,
    mode: 'history',
});
