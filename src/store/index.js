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
    todos: []
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
          completed: false,
          uid: uid
        })
        .then(docRef => {
          commit('ADD_TODO', {
            id: docRef.id,
            content: todo,
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
    DELETE_TODO({ commit, dispatch }, todo) {
      fb.db
        .collection('todo')
        .doc(todo.id)
        .delete()
        .then(() => commit('DELETE_TODO', todo.id))
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
            completed: todo.completed
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
    ERROR_HANDLER({ commit }, error) {
      commit('ADD_ERROR', error)
    }
  },
  getters: {
    allTodos(state) {
      return state.todos
    },
    completedTodos(state) {
      return state.todos.filter(todo => todo.completed === true)
    },
    notCompletedTodos(state) {
      return state.todos.filter(todo => todo.completed === false)
    }
  },
  modules: {}
})
