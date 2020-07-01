export const namespaced = true

const state = {
  errorMessage: ''
}
const mutations = {
  ADD_ERROR(state, error) {
    state.errorMessage = error.message
  }
}
const actions = {
  addError({ commit }, error) {
    commit('ADD_ERROR', error)
  }
}
const getters = {}

export { state, mutations, actions, getters }
