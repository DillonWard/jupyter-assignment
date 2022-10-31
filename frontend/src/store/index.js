import Vue from 'vue';
import Vuex from 'vuex';
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    persistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    isQuerying: false,
    form: null,
  },
  mutations: {
    TOGGLE_QUERY_FORM(state, isQuerying) {
      state.isQuerying = isQuerying;
    },
    SET_FORM_TYPE(state, form) {
      state.form = form;
    },
  },

  getters: {
    getIsQuerying: (state) => {
      return state.isQuerying;
    },
    getFormState: (state) => {
      return state.form;
    },
  },

  actions: {
    toggleQueryForm: (context, isQuerying) => {
      context.commit('TOGGLE_QUERY_FORM', isQuerying);
    },
    setFormType: (context, form) => {
      context.commit('SET_FORM_TYPE', form);
    },
  },
});
