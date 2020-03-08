import { Product } from '../../data/Product';
import axios, { AxiosRequestConfig } from 'axios';
import { handleError } from '../utils/requestHelpers';

const baseUrl = '/api/product';

type ProductState = {
    products: Product[],
}
const state = {
    products: [] as Product[],
} as ProductState;

const getters = {
    products: (state: ProductState): Product[] => state.products,
};

const actions = {
    fetchProducts: async ({commit}: any): Promise<void> => {
        try {
            const response = await axios.get(baseUrl);
            return commit ('SET_PRODUCTS', Product.createMultipleFromResponse(response.data));
        }
        catch (error) {
            return handleError(error);
        }
    },
    addProduct: async ({commit}: any, product: Product): Promise<void> => {
        try {
            const response = await axios.post(baseUrl, product);
            return commit('ADD_PRODUCT', Product.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
    editProduct: async ({commit}: any, product: Product): Promise<void> => {
        try {
            const response = await axios.put(baseUrl + '/' + product.id, product);
            return commit('UPDATE_PRODUCT', Product.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
    deleteProduct: async ({commit}: any, product: Product): Promise<void> => {
        try {
            const response = await axios.delete(baseUrl + '/' + product.id);
            return commit('REMOVE_PRODUCT', Product.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
};

const mutations = {
    SET_PRODUCTS: (state: ProductState, products: Product[]): void => {
        state.products = products;
    },
    ADD_PRODUCT: (state: ProductState, product: Product): void => {
        state.products.unshift(product);
    },
    UPDATE_PRODUCT: (state: ProductState, product: Product): void  => {
        state.products = state.products.map(value => product.isEqualToProduct(value) ? product : value);
    },
    REMOVE_PRODUCT: (state: ProductState, product: Product): void => {
        state.products = state.products.filter(value => product.isNotEqualToProduct(value));
    },
};

export default {
    namespaced: true as true,
    state,
    getters,
    actions,
    mutations,
};
