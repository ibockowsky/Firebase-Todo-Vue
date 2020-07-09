import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '@/store/index.js'
import firebase from 'firebase/app'

import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import TodoModal from '@/components/TodoModal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      disabledForLogged: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      disabledForLogged: true
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: ':todoId',
        component: TodoModal,
        props: true,
        meta: {
          showModal: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const disabledForLogged = to.matched.some(x => x.meta.disabledForLogged)
  const currentUser = firebase.auth().currentUser

  store.commit('alerts/ADD_ERROR', '')
  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else if (disabledForLogged && currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
