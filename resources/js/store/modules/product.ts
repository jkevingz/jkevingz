import { Product } from '../../data/Product';
import axios from 'axios';

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
        const response = await axios.get(baseUrl);

        if (response.status === 200) {
            commit('setProducts', Product.createMultipleFromResponse(response.data));
        }
    },
    addProduct: async ({commit}: any, product: Product): Promise<void> => {
        const response = await axios.post(baseUrl, product);

        if (response.status === 201) {
            commit('newProduct', Product.createSingleFromResponse(response.data));
        }
    },
    editProduct: async ({commit}: any, product: Product): Promise<void> => {
        const response = await axios.put(baseUrl + '/' + product.id, product);

        commit('updateProduct', Product.createSingleFromResponse(response.data));
    },
    deleteProduct: async ({commit}: any, product: Product): Promise<void> => {
        const response = await axios.delete(baseUrl + '/' + product.id);

        commit('removeProduct', Product.createSingleFromResponse(response.data));
    },
};

const mutations = {
    setProducts: (state: ProductState, products: Product[]): void => {
        state.products = products;
    },
    newProduct: (state: ProductState, product: Product): void => {
        state.products.unshift(product);
    },
    updateProduct: (state: ProductState, product: Product): void  => {
        state.products = state.products.map(value => product.isEqualToProduct(value) ? product : value);
    },
    removeProduct: (state: ProductState, product: Product): void => {
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
