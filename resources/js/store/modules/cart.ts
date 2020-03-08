import axios, { AxiosRequestConfig } from 'axios';
import { Product } from '../../data/Product';
import { handleError } from '../utils/requestHelpers';

const LOCAL_STORAGE_NAME = 'products_cart';

type CartState = {
    productIds: number[],
    cartProducts: Product[],
}
const state = {
    productIds: [] as number[],
    cartProducts: [] as Product[],
} as CartState;

const getters = {
    productIds: (state: CartState) => state.productIds,
    cartProducts: (state: CartState) => state.cartProducts,
};

const actions = {
    fetchProductIds: async ({commit}: any): Promise<void> => {
        const string = localStorage.getItem(LOCAL_STORAGE_NAME);
        const json = JSON.parse(string + '');
        let ids: string[] = [];
        if (json) {
            ids = Object.keys(json);
        }

        return commit('SET_PRODUCT_IDS', ids);
    },
    fetchCartProducts: async ({commit}: any, productIds: number[]): Promise<void> => {
        // If there are no items to pull, empty the cart products.
        if (!productIds.length) {
            return commit('SET_CART_PRODUCTS', []);
        }
        try {
            const config: AxiosRequestConfig = {};
            config.params = {
                ids: productIds,
            };
            const response = await axios.get('/api/product', config);
            return commit ('SET_CART_PRODUCTS', Product.createMultipleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
    addProductId: ({commit}: any, id: number): void => {
        const string = localStorage.getItem(LOCAL_STORAGE_NAME);
        let json = JSON.parse(string + '');
        if (!json) {
            json = {};
        }
        json[id] = 1;
        
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(json));
        commit('ADD_PRODUCT_ID', id);
    },
    addProductUnit: ({commit}: any, id: number): void => {
        const string = localStorage.getItem(LOCAL_STORAGE_NAME);
        const json = JSON.parse(string + '');
        if (json[id] !== undefined) {
            json[id]++;
            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(json));
        }
    },
    substractProductUnit: ({commit}: any, id: number): void => {
        const string = localStorage.getItem(LOCAL_STORAGE_NAME);
        const json = JSON.parse(string + '');
        if (json[id] > 1) {
            json[id]--;
            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(json));
        }
    },
    removeProductId: ({commit}: any, id: number): void => {
        const string = localStorage.getItem(LOCAL_STORAGE_NAME);
        let json = JSON.parse(string + '');
        if (json) {
            delete json[id];
            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(json));
            commit('REMOVE_PRODUCT_ID', id);
        }
    },
    clearCart: ({commit}: any): void => {
        localStorage.removeItem(LOCAL_STORAGE_NAME);
        commit('CLEAR_CART');
    }
};

const mutations = {
    SET_PRODUCT_IDS: (state: CartState, ids: number[]): void => {
        state.productIds = ids;
    },
    SET_CART_PRODUCTS: (state: CartState, products: Product[]): void => {
        state.cartProducts = products;
    },
    ADD_PRODUCT_ID: (state: CartState, id: number): void => {
        state.productIds.push(id);
    },
    REMOVE_PRODUCT_ID: (state: CartState, id: number): void => {
        state.productIds = state.productIds.filter(item => item !== id);
        // If the products are set, remove the product from there as well.
        if (state.cartProducts.length) {
            state.cartProducts = state.cartProducts.filter(value => value.id !== id);
        }
    },
    CLEAR_CART: (state: CartState): void => {
        state.productIds = [];
        state.cartProducts = [];
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};