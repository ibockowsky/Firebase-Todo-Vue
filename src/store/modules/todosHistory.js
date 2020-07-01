const fb = require('@/services/firebase.js')

export const namespaced = true

const state = {
  todosHistory: []
}
const mutations = {
  SET_TODOS_HISTORY(state, todos) {
    state.todosHistory = todos
  },
  ADD_TODO_HISTORY(state, todo) {
    state.todosHistory.push(todo)
  }
}
const actions = {
  getTodosHistory({ commit, dispatch, rootGetters }) {
    const uid = rootGetters['users/getUserId']
    fb.db
      .collection('todoHistory')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        let tempArray = []
        querySnapshot.forEach(doc => {
          tempArray.push({
            id: doc.id,
            content: doc.data().content,
            deleted_at: doc.data().deleted_at
          })
        })
        const arraySorted = tempArray.sort((a, b) => {
          return a.deleted_at.seconds - b.deleted_at.seconds
        })
        commit('SET_TODOS_HISTORY', arraySorted)
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  }
}
const getters = {
  isTodoHistory(state) {
    return state.todosHistory.length > 0
  }
}

export { state, mutations, actions, getters }
