import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import axios from './axios';
import webSocketService from "./websocket";

// définir votre propre type d'état
export interface State {
  accessToken: string | null;
  refreshToken : string | null;

  userType: number | null;

  restaurantId: number | null;
  restaurantName: string | null;
  restaurantAddress: string | null;
  restaurantDescription: string | null;
  restaurantType: string | null;
  restaurantCountry: string | null;
  restaurantMail: string | null;
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({

  state: {
    accessToken: null,
    refreshToken: null,

    userType: null,

    restaurantId: null,
    restaurantName: null,
    restaurantAddress: null,
    restaurantDescription: null,
    restaurantType: null,
    restaurantCountry: null,
    restaurantMail: null
  },

  mutations: {
    setAccessToken(state, token: string) {
      state.accessToken = token;
      localStorage.setItem('accessToken', token);
    },
    clearAccessToken(state) {
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },

    setRefreshToken(state, token: string) {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', token);
    },
    clearRefreshToken(state) {
      state.refreshToken = null;
      localStorage.removeItem('refreshToken');
    },

    setUserType(state, userType: number) {
      state.userType = userType;
    },
    clearUserType(state) {
      state.userType = null;
    },


    setRestaurantId(state, restaurantId: number) {
      state.restaurantId = restaurantId;
    },
    clearRestaurantId(state) {
      state.restaurantId = null;
    },

    setRestaurantName(state, restaurantName: string) {
      state.restaurantName = restaurantName;
    },
    clearRestaurantName(state) {
      state.restaurantName = null;
    },

    setRestaurantAddress(state, restaurantAddress: string) {
      state.restaurantAddress = restaurantAddress;
    },
    clearRestaurantAddress(state) {
      state.restaurantAddress = null;
    },

    setRestaurantDescription(state, restaurantDescription: string) {
      state.restaurantDescription = restaurantDescription;
    },
    clearRestaurantDescription(state) {
      state.restaurantDescription = null;
    },

    setRestaurantType(state, restaurantType: string) {
      state.restaurantType = restaurantType;
    },
    clearRestaurantType(state) {
      state.restaurantType = null;
    },

    setRestaurantCountry(state, restaurantCountry: string) {
      state.restaurantCountry = restaurantCountry;
    },
    clearRestaurantCountry(state) {
      state.restaurantCountry = null;
    },

    setRestaurantMail(state, restaurantMail: string) {
      state.restaurantMail = restaurantMail;
    },
    clearRestaurantMail(state) {
      state.restaurantMail = null;
    },
  },

  actions: {
    initializeStore(context) {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        context.commit('setAccessToken', accessToken);
        context.commit('setRefreshToken', refreshToken);
        store.dispatch('loginRoutine');        
      }
    },

    async loginRoutine(context) {
      if(context.getters.isAuthenticated === true) {
        await context.dispatch('getUserType');
        webSocketService.connect();

        if(context.getters.getUserType === 3) {
          webSocketService.joinLivreurRoom();
        }

        else if(context.getters.getUserType === 2) {
          await context.dispatch('getRestaurant');
          webSocketService.joinRestaurateurRoom();
          console.log(context.getters.getRestaurantId)
        }

        else if(context.getters.getUserType === 1) {
          webSocketService.joinClientRoom();
        }
      }
    },

    async logoutRoutine(context) {
      context.commit('clearAccessToken');
      context.commit('clearRefreshToken');

      context.commit('clearUserType');

      context.commit('clearRestaurantId');
      context.commit('clearRestaurantName');
      context.commit('clearRestaurantAddress');
      context.commit('clearRestaurantDescription');
      context.commit('clearRestaurantType');
      context.commit('clearRestaurantCountry');
      context.commit('clearRestaurantMail');

      webSocketService.disconnect();
    },

    async refreshTokens(context) {
      try {
        const response = await axios.post('/auth/refresh', {
          token: context.state.refreshToken
        });
  
        context.commit('setAccessToken', response.data.accessToken);
        context.commit('setRefreshToken', response.data.refreshToken);
      } catch (error) {
        context.commit('clearAccessToken');
        context.commit('clearRefreshToken');
      }
    },

    async getUserType(context) {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get('/auth/get-type',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        context.commit('setUserType', response.data);
      } catch (error) {
        console.log('Erreur lors de la récupération du type d\'utilisateur', error);
      }
    },

    async getRestaurant(context) {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get('/api/display-restaurant',
          {
            headers: {
              'Authorization' : `Bearer ${accessToken}`
            }
          });

        console.log(response)
        
        context.commit('setRestaurantId', response.data.o_user_id);
        context.commit('setRestaurantName', response.data.o_user_nom);
        context.commit('setRestaurantAddress', response.data.o_user_adresse);
        context.commit('setRestaurantDescription', response.data.o_user_desc);
        context.commit('setRestaurantType', response.data.o_user_type);
        context.commit('setRestaurantCountry', response.data.o_user_pays);
        context.commit('setRestaurantMail', response.data.o_user_email);

      } catch (error) {
        console.log('Erreur lors de la récupération du restaurant', error);
      }
    }
  },
  
  getters: {
    isAuthenticated(state) {
      return !!state.accessToken;
    },

    getUserType(state) {
      return state.userType;
    },

    getRestaurantId(state) {
      return state.restaurantId;
    },
    getRestaurantName(state) {
      return state.restaurantName;
    },
    getRestaurantAddress(state) {
      return state.restaurantAddress;
    },
    getRestaurantDescription(state) {
      return state.restaurantDescription;
    },
    getRestaurantType(state) {
      return state.restaurantType;
    },
    getRestaurantCountry(state) {
      return state.restaurantCountry;
    },
    getRestaurantMail(state) {
      return state.restaurantMail;
    }
  }
});

export function useStore() {
  return baseUseStore(key);
}