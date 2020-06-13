import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index.js'
const fb = require('@/services/firebase.js')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('SET_USER', user)
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    errorMessages: []
  },
  mutations: {
    SET_USER(state, user) {
      state.currentUser = user
    },
    CLEAR_DATA(state) {
      state.currentUser = null
    },
    ADD_ERROR(state, error) {
      if (state.errorMessages.includes(error.message)) {
        state.errorMessages = state.errorMessages.filter(
          el => el !== error.message
        )
      }
      state.errorMessages.push(error.message)
    },
    CLEAR_ERRORS(state) {
      state.errorMessages = []
    }
  },
  actions: {
    REGISTER({ commit, dispatch }, credentials) {
      fb.auth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(user => {
          commit('SET_USER', user)
          router.push('/dashboard')
        })
        .catch(err => {
          dispatch('ERROR_HANDLER', err)
        })
    },
    LOGIN({ commit, dispatch }, credentials) {
      fb.auth
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(user => {
          commit('SET_USER', user)
          router.push('/dashboard')
        })
        .catch(err => {
          dispatch('ERROR_HANDLER', err)
        })
    },
    LOGOUT({ commit }) {
      fb.auth
        .signOut()
        .then(() => {
          commit('CLEAR_DATA')
          router.push('/')
        })
        .catch(err => {
          console.log(err)
        })
    },
    ERROR_HANDLER({ commit }, error) {
      commit('ADD_ERROR', error)
    }
  },
  modules: {}
})
