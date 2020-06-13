<template>
  <div class="home container mx-auto">
    <div class="xs:w-full md:w-full lg:w-1/2 xl:w-1/2 mx-auto">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            E-mail
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            v-model="form.password"
            type="password"
            placeholder="******************"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click.prevent="register"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    register() {
      this.$store.dispatch('REGISTER', this.form)
    }
  }
}
</script>

<style lang="scss" scoped></style>
