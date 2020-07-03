<template>
  <div id="app">
    <NavBar />
    <div class="p-5 m-5">
      <div class="home container mx-auto">
        <div class="xs:w-full md:w-full lg:w-1/2 xl:w-1/2 mx-auto">
          <ErrorMessage
            v-if="errorMessage"
            :error="errorMessage"
            class="m-3 mx-auto"
          />
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBar from '@/components/NavBar.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  components: {
    NavBar,
    ErrorMessage
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapState('alerts', ['errorMessage'])
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
