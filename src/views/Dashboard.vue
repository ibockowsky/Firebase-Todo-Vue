<template>
  <div>
    <div class="home container mx-auto">
      <div class="xs:w-full md:w-full lg:w-1/2 xl:w-1/2 mx-auto">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div v-if="todos.length <= 0">No todos.</div>
          <transition-group name="slide" appear>
            <Todo v-for="todo in todos" :key="todo.id" :todo="todo" />
          </transition-group>

          <div
            class="flex items-center border-b border-b-2 border-teal-500 py-2"
          >
            <input
              class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              v-model="todo"
              placeholder="Buy milk"
            />
            <button
              class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              @click.prevent="add"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Todo from '@/components/Todo.vue'
export default {
  computed: {
    ...mapState(['todos'])
  },
  components: {
    Todo
  },
  data() {
    return {
      todo: ''
    }
  },
  created() {
    this.$store.dispatch('GET_TODOS')
  },
  methods: {
    add() {
      this.$store.dispatch('ADD_TODO', this.todo)
      this.todo = ''
    }
  }
}
</script>

<style scoped>
.slide-enter {
  transform: translateY(10px);
  opacity: 0;
}
.slide-leave {
  transform: translateY(-10px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-move {
  transition: transform 0.8s ease-in;
}
.slide-leave-move {
  transition: transform 0.8s ease-out;
}
</style>
