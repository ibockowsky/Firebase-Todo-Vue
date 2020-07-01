<template>
  <nav class="bg-white px-8 pt-2 shadow-md">
    <div class="flex justify-center">
      <router-link
        v-if="!isLoggedIn"
        to="/login"
        class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >
        Login
      </router-link>
      <router-link
        v-if="!isLoggedIn"
        to="/register"
        class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >
        Register
      </router-link>
      <router-link
        v-if="isLoggedIn"
        to="/"
        class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mr-8"
      >
        Todo List
      </router-link>
      <button
        v-if="isLoggedIn"
        class="bg-transparent uppercase text-xs hover:bg-teal-600 text-teal-700 font-semibold hover:text-white py-1 px-3 mr-8 border border-teal-600 hover:border-transparent rounded"
        @click.prevent="logout"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('users', ['isLoggedIn'])
  },
  methods: {
    logout() {
      this.$store.dispatch('users/logoutUser')
    }
  }
}
</script>

<style scoped>
.router-link-exact-active {
  @apply text-teal-600;
  @apply border-teal-600;
}
</style>
