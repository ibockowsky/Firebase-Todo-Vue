const fb = require('@/services/firebase.js')

export const namespaced = true

const state = {
  todosHistory: [],
  isLoading: true
}
const mutations = {
  SET_TODOS_HISTORY(state, todos) {
    state.todosHistory = todos
  },
  ADD_TODO_HISTORY(state, todo) {
    state.todosHistory.push(todo)
  },
  CHANGE_LOADING_STATE(state, val) {
    state.isLoading = val
  }
}
const actions = {
  getTodosHistory({ commit, dispatch, rootGetters }) {
    commit('CHANGE_LOADING_STATE', true)
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
        commit('CHANGE_LOADING_STATE', false)
        commit('SET_TODOS_HISTORY', arraySorted)
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  removeTodosHistory({ commit, state }) {
    state.todosHistory.forEach(todo => {
      fb.db
        .collection('todoHistory')
        .doc(todo.id)
        .delete()
        .catch(err => {
          dispatch('alerts/addError', err, { root: true })
        })
    })
    commit('SET_TODOS_HISTORY', [])
  }
}
const getters = {
  isTodoHistory(state) {
    return state.todosHistory.length > 0
  },
  showLoading(state) {
    if (state.todosHistory.length === 0) {
      return true
    } else {
      return false
    }
  }
}

export { state, mutations, actions, getters }
