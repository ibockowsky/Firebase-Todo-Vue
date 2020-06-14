<template>
  <div id="app">
    <NavBar />
    <div class="p-5 m-5">
      <ErrorMessages
        v-if="errorMessages.length > 0"
        :errors="errorMessages"
        class="w-1/4 mx-auto m-3"
      />
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar.vue'
import ErrorMessages from '@/components/ErrorMessages.vue'

export default {
  components: {
    NavBar,
    ErrorMessages
  },
  computed: {
    ...mapState(['errorMessages'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
