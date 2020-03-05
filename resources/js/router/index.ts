import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '../components/pages/store/Store.vue';
import Cart from '../components/pages/cart/Cart.vue';
import Admin from '../components/pages/admin/Admin.vue';
import Users from '../components/pages/admin/users/Users.vue';
import Products from '../components/pages/admin/products/Products.vue';

Vue.use(VueRouter);

const routes = [
    {
        component: Store,
        name: 'store',
        path: '/store',
        meta: {
            title: 'Store',
        },
    },
    {
        component: Cart,
        name: 'cart',
        path: '/cart',
        meta: {
            title: 'Cart',
        },
    },
    {
        component: Admin,
        path: '/admin',
        meta: {
            title: 'Admin',
        },
        children: [
            {
                component: Users,
                name: 'users',
                path: 'users',
                meta: {
                    title: 'Users',
                },
            },
            {
                component: Products,
                name: 'products',
                path: 'products',
                meta: {
                    title: 'Products',
                },
            },
            {
                path: '',
                redirect: 'users',
            },
        ],
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
