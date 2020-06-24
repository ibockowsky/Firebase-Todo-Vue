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
    errorMessage: '',
    todos: [],
    todosHistory: []
  },
  mutations: {
    SET_USER(state, user) {
      state.currentUser = user
    },
    CLEAR_DATA(state) {
      state.currentUser = null
    },
    ADD_ERROR(state, error) {
      state.errorMessage = error.message
    },
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
        created_at: todo.created_at,
        completed: todo.completed
      })
    },
    SET_COMPLETED(state, isChecked) {
      state.todos.forEach(todo => (todo.completed = isChecked))
    },
    SET_TODOS_HISTORY(state, todos) {
      state.todosHistory = todos
    },
    ADD_TODO_HISTORY(state, todo) {
      state.todosHistory.push(todo)
    }
  },
  actions: {
    REGISTER({ commit, dispatch }, credentials) {
      fb.auth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(user => {
          commit('SET_USER', user)
          router.push('/')
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
          router.push('/')
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
          router.push('/login')
        })
        .catch(err => {
          dispatch('ERROR_HANDLER', err)
        })
    },
    ADD_TODO({ commit, state, dispatch }, todo) {
      const uid = state.currentUser.uid
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
          dispatch('ERROR_HANDLER', err)
        })
    },
    GET_TODOS({ commit, dispatch, state }) {
      const uid = state.currentUser.uid
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
          dispatch('ERROR_HANDLER', err)
        })
    },
    GET_TODOS_HISTORY({ commit, dispatch, state }) {
      const uid = state.currentUser.uid
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
          dispatch('ERROR_HANDLER', err)
        })
    },
    DELETE_TODO({ commit, dispatch, getters, state }, id) {
      const uid = state.currentUser.uid
      const todo = getters.getTodo(id)
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
              commit('ADD_TODO_HISTORY', {
                id: docRef.id,
                content: todo.content,
                text: 'No text',
                deleted_at: new Date(),
                completed: false
              })
            })
            .catch(err => {
              dispatch('ERROR_HANDLER', err)
            })
          commit('DELETE_TODO', id)
        })
        .catch(err => {
          dispatch('ERROR_HANDLER', err)
        })
    },
    UPDATE_TODO({ commit, dispatch }, todo) {
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
          dispatch('ERROR_HANDLER', err)
        })
    },
    SET_COMPLETED({ commit, state }, isChecked) {
      const uid = state.currentUser.uid
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
    },
    ERROR_HANDLER({ commit }, error) {
      commit('ADD_ERROR', error)
    }
  },
  getters: {
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
    },
    isTodoHistory(state) {
      return state.todosHistory.length > 0
    }
  },
  modules: {}
})
