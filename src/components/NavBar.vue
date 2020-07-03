<template>
  <nav class="bg-white px-8 pt-2 shadow-md">
    <div class="relative flex flex-wrap items-center justify-center">
      <div class="flex">
        <router-link
          v-if="!isLoggedIn"
          to="/login"
          class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mx-1"
        >
          Login
        </router-link>
        <router-link
          v-if="!isLoggedIn"
          to="/register"
          class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mx-1"
        >
          Register
        </router-link>
        <router-link
          v-if="isLoggedIn"
          to="/"
          class="no-underline text-grey-600 border-b-2 border-transparent uppercase tracking-wide font-bold text-xs py-3 mx-1"
        >
          Todo List
        </router-link>
      </div>
      <div class="absolute right-0">
        <button
          v-if="isLoggedIn"
          class="bg-transparent uppercase text-xs hover:bg-teal-600 text-teal-700 font-semibold hover:text-white py-1 px-3 border border-teal-600 hover:border-transparent rounded mx-1"
          @click.prevent="logout"
        >
          Logout
        </button>
      </div>
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
