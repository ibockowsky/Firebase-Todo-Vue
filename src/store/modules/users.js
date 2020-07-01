import router from '@/router'
const fb = require('@/services/firebase.js')

export const namespaced = true

const state = {
  currentUser: null
}
const mutations = {
  SET_USER(state, user) {
    state.currentUser = user
  },
  CLEAR_USER_DATA(state) {
    state.currentUser = null
  }
}
const actions = {
  registerUser({ commit, dispatch }, credentials) {
    fb.auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(user => {
        commit('SET_USER', user)
        router.push('/')
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  loginUser({ commit, dispatch }, credentials) {
    fb.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(user => {
        commit('SET_USER', user)
        router.push('/')
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  logoutUser({ commit }) {
    fb.auth
      .signOut()
      .then(() => {
        commit('CLEAR_USER_DATA')
        router.push('/login')
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  }
}
const getters = {
  getUserId(state) {
    return state.currentUser.uid
  },
  isLoggedIn(state) {
    return !!state.currentUser
  }
}

export { state, mutations, actions, getters }
