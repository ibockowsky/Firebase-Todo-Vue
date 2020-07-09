<template>
  <div>
    <div class="home container mx-auto">
      <div class="xs:w-full md:w-full lg:w-1/2 xl:w-1/2 mx-auto">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-5 mb-4">
          <ul class="flex flex-col md:flex-row  lg:flex-row xl:flex-row m-2">
            <li v-for="tab in tabs" :key="tab" class="flex-1 mr-2">
              <button
                class="text-center capitalize block border border-white rounded hover:border-gray-200 text-teal-500 hover:bg-gray-200 py-2 px-4 w-full"
                :class="{ 'tab-active': currentTab == tab }"
                @click.prevent="changeTab(tab)"
              >
                {{ tab }}
              </button>
            </li>
          </ul>
          <div>
            <div v-if="showModal"><router-view /></div>
          </div>
          <transition-group name="slide" appear>
            <template v-if="currentTab == 'all'">
              <Todo
                v-for="todo in todos"
                :key="todo.id"
                :todo="todo"
                :checkAllTodos="!anyToGoTodos"
              />
            </template>
            <template v-if="currentTab == 'completed'">
              <Todo
                v-for="todo in completedTodos"
                :key="todo.id"
                :todo="todo"
                :checkAllTodos="!anyToGoTodos"
              />
            </template>
            <template v-if="currentTab == 'not completed'">
              <Todo
                v-for="todo in notCompletedTodos"
                :key="todo.id"
                :todo="todo"
                :checkAllTodos="!anyToGoTodos"
              />
            </template>
          </transition-group>
          <div
            class="flex items-center border-b border-b-2 border-teal-500 py-2"
          >
            <input
              class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              v-model="todo"
              placeholder="Buy milk"
              @keyup.enter="add"
            />
            <button
              class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              @click.prevent="add"
            >
              Add
            </button>
          </div>
          <div class="flex flex-row-reverse pt-3">
            <div class="">
              <div class="">
                <input
                  id="checkAllCheckox"
                  type="checkbox"
                  :checked="toGoTodos === 0"
                  @change="checkAllTodos"
                  class="m-1 p-1"
                />
                <label for="checkAllCheckbox">Mark as done!</label>
              </div>
              <div
                v-if="todosHistory.length > 0"
                @click.prevent="clearTodosHistory"
              >
                Clear history
              </div>
            </div>
          </div>
        </div>
        <div class="m-5">
          <TodoHistory :todos="todosHistory" :loadingSpinner="isLoading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Todo from '@/components/Todo.vue'
import TodoHistory from '@/components/TodoHistory.vue'
export default {
  computed: {
    ...mapState('todos', ['todos']),
    ...mapState('todosHistory', ['todosHistory', 'isLoading']),
    ...mapGetters('todos', [
      'completedTodos',
      'notCompletedTodos',
      'toGoTodos',
      'anyToGoTodos'
    ]),
    ...mapGetters('todosHistory', ['isTodoHistory'])
  },
  components: {
    Todo,
    TodoHistory
  },
  data() {
    return {
      todo: '',
      tabs: ['all', 'completed', 'not completed'],
      currentTab: 'all',
      showModal: false
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.showModal = newVal.meta && newVal.meta.showModal
    }
  },
  created() {
    this.$store.dispatch('todos/getTodos')
    this.$store.dispatch('todosHistory/getTodosHistory')
  },
  methods: {
    add() {
      this.$store.dispatch('todos/addTodo', this.todo)
      this.todo = ''
    },
    changeTab(tab) {
      this.currentTab = tab
    },
    checkAllTodos() {
      this.$store.dispatch('todos/setTodosCompleted', event.target.checked)
    },
    clearTodosHistory() {
      this.$store.dispatch('todosHistory/removeTodosHistory')
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
.tab-active {
  @apply bg-teal-500;
  @apply text-white;
}
.tab-active:hover {
  @apply bg-teal-700;
}
</style>
