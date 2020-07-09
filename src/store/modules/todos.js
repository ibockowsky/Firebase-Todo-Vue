const fb = require('@/services/firebase.js')

export const namespaced = true

const state = {
  todos: []
}
const mutations = {
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  },
  SET_TODOS(state, todos) {
    state.todos = todos
  },
  DELETE_TODO(state, id) {
    const index = state.todos.findIndex(item => item.id == id)
    if (index >= 0) {
      state.todos.splice(index, 1)
    }
  },
  UPDATE_TODO(state, todo) {
    const index = state.todos.findIndex(item => item.id == todo.id)
    state.todos.splice(index, 1, {
      id: todo.id,
      content: todo.content,
      text: todo.text,
      created_at: todo.created_at,
      completed: todo.completed
    })
  },
  SET_COMPLETED(state, isChecked) {
    state.todos.forEach(todo => (todo.completed = isChecked))
  }
}
const actions = {
  addTodo({ commit, dispatch, rootGetters }, todo) {
    const uid = rootGetters['users/getUserId']
    fb.db
      .collection('todo')
      .add({
        content: todo,
        created_at: new Date(),
        text: 'No text',
        completed: false,
        uid: uid
      })
      .then(docRef => {
        commit('ADD_TODO', {
          id: docRef.id,
          content: todo,
          text: 'No text',
          created_at: new Date(),
          completed: false
        })
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  getTodos({ commit, dispatch, rootGetters }) {
    const uid = rootGetters['users/getUserId']
    fb.db
      .collection('todo')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        let tempArray = []
        querySnapshot.forEach(doc => {
          tempArray.push({
            id: doc.id,
            content: doc.data().content,
            text: doc.data().text,
            created_at: doc.data().created_at,
            completed: doc.data().completed
          })
        })
        const arraySorted = tempArray.sort((a, b) => {
          return a.created_at.seconds - b.created_at.seconds
        })
        commit('SET_TODOS', arraySorted)
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  deleteTodo({ commit, dispatch, rootGetters, getters }, id) {
    const uid = rootGetters['users/getUserId']
    const todo = getters['getTodo'](id)
    fb.db
      .collection('todo')
      .doc(id)
      .delete()
      .then(() => {
        fb.db
          .collection('todoHistory')
          .add({
            content: todo.content,
            text: todo.text,
            deleted_at: new Date(),
            uid: uid
          })
          .then(docRef => {
            commit(
              'todosHistory/ADD_TODO_HISTORY',
              {
                id: docRef.id,
                content: todo.content,
                text: 'No text',
                deleted_at: new Date(),
                completed: false
              },
              { root: true }
            )
          })
          .catch(err => {
            dispatch('alerts/addError', err, { root: true })
          })
        commit('DELETE_TODO', id)
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  updateTodo({ commit, dispatch }, todo) {
    fb.db
      .collection('todo')
      .doc(todo.id)
      .set(
        {
          content: todo.content,
          completed: todo.completed,
          text: !!todo.text ? todo.text : 'No text.'
        },
        { merge: true }
      )
      .then(() => {
        commit('UPDATE_TODO', todo)
      })
      .catch(err => {
        dispatch('alerts/addError', err, { root: true })
      })
  },
  setTodosCompleted({ commit, rootGetters }, isChecked) {
    const uid = rootGetters['users/getUserId']
    fb.db
      .collection('todo')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref
            .update({
              completed: isChecked
            })
            .then(() => {
              commit('SET_COMPLETED', isChecked)
            })
        })
      })
  }
}
const getters = {
  completedTodos(state) {
    return state.todos.filter(todo => todo.completed === true)
  },
  notCompletedTodos(state) {
    return state.todos.filter(todo => todo.completed === false)
  },
  toGoTodos(state) {
    return state.todos.filter(todo => !todo.completed).length
  },
  anyToGoTodos(state, getters) {
    return getters.toGoTodos != 0
  },
  getTodo: state => id => {
    return state.todos.filter(todo => todo.id === id)[0]
  }
}

export { state, mutations, actions, getters }
