import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import '@/assets/css/tailwind.css'
import moment from 'moment'
const fb = require('@/services/firebase.js')

Vue.config.productionTip = false

Vue.filter('formatDate', value => {
  if (value) {
    return moment(value, 'DD.MM.YYYY hh:mm:ss').format('DD.MM.YYYY @ HH:mm:ss')
  }
})

let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
