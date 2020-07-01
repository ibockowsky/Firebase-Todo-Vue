import Vue from 'vue'
import Vuex from 'vuex'
import * as users from '@/store/modules/users.js'
import * as todos from '@/store/modules/todos.js'
import * as todosHistory from '@/store/modules/todosHistory.js'
import * as alerts from '@/store/modules/alerts.js'
const fb = require('@/services/firebase.js')

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    users,
    todos,
    todosHistory,
    alerts
  }
})

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('users/SET_USER', user)
  }
})
