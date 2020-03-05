import { User } from '../../data/User';
import axios from 'axios';
import { handleError } from '../utils/requestHelpers';

const baseUrl = '/api/user';

type UserState = {
    users: User[],
}
const state = {
    users: [] as User[],
} as UserState;

const getters = {
    users: (state: UserState): User[] => state.users,
};

const actions = {
    fetchUsers: async ({commit}: any): Promise<void> => {
        try {
            const response = await axios.get(baseUrl);
            return commit('SET_USERS', User.createMultipleFromResponse(response.data));
        }
        catch (error) {
            return handleError(error);
        }
    },
    addUser: async ({commit}: any, user: User): Promise<void> => {
        try {
            const response = await axios.post(baseUrl, user);
            commit('ADD_USER', User.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
    editUser: async ({commit}: any, user: User): Promise<void> => {
        try {
            const response = await axios.put(baseUrl + '/' + user.id, user);
            commit('UPDATE_USER', User.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
    deleteUser: async ({commit}: any, user: User): Promise<void> => {
        try {
            const response = await axios.delete(baseUrl + '/' + user.id);
            commit('REMOVE_USER', User.createSingleFromResponse(response.data));
        }
        catch (error) {
            handleError(error);
        }
    },
};

const mutations = {
    SET_USERS: (state: UserState, users: User[]): void => {
        state.users = users;
    },
    ADD_USER: (state: UserState, user: User): void => {
        state.users.unshift(user);
    },
    UPDATE_USER: (state: UserState, user: User): void  => {
        state.users = state.users.map(value => user.isEqualToUser(value) ? user : value);
    },
    REMOVE_USER: (state: UserState, user: User): void => {
        state.users = state.users.filter(value => user.isNotEqualToUser(value));
    },
};

export default {
    namespaced: true as true,
    state,
    getters,
    actions,
    mutations,
};
