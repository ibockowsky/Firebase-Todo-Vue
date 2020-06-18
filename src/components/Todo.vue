<template>
  <div class="flex">
    <div
      class="bg-white shadow m-1 p-3 text-left w-full"
      @click.self="changeRoute(id)"
    >
      <input
        type="checkbox"
        v-model="completed"
        class="mr-2 leading-tight"
        @change="editDoneTodo()"
      />
      <span
        v-if="!editing"
        class="font-sans font-bold subpixel-antialiased text-xl"
        :class="{ completed: completed }"
        @dblclick.self="editTodo()"
        >{{ content }}
      </span>
      <input
        v-else
        type="text"
        class="font-sans subpixel-antialiased text-xl border-b border-b-2 border-teal-500"
        v-model="content"
        @blur="editDoneTodo()"
        @keyup.enter="editDoneTodo()"
        @keyup.esc="editExitTodo()"
      />

      <div class="inline-flex float-right">
        <span
          class="font-sans subpixel-antialiased text-gray-500 text-sm px-2 py-1"
          >{{ created_at | formatDate }}</span
        >
        <button
          class="bg-red-300 hover:bg-red-400 text-red-800 font-bold p-2 rounded items-center float-right"
          type="button"
          @click="deleteTodo()"
        >
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path
              d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true
    },
    checkAllTodos: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      id: this.todo.id,
      content: this.todo.content,
      completed: this.todo.completed,
      text: this.todo.text,
      created_at:
        this.todo.created_at instanceof Date
          ? this.todo.created_at
          : this.todo.created_at.toDate(),
      editing: false
    }
  },
  watch: {
    checkAllTodos() {
      this.completed = this.checkAllTodos ? true : this.todo.completed
    },
    todo_data() {
      this.content = this.todo.content
      this.completed = this.todo.completed
    }
  },
  methods: {
    deleteTodo() {
      this.$store.dispatch('DELETE_TODO', this.id)
    },
    editTodo() {
      this.beforeEdit = this.content
      if (this.completed) {
        return
      }
      this.editing = true
    },
    editDoneTodo() {
      if (this.content.trim == '') {
        this.content = this.beforeEdit
      }
      let toUpdate = {
        id: this.id,
        content: this.content,
        created_at: this.created_at,
        text: this.text,
        completed: this.completed
      }
      this.$store.dispatch('UPDATE_TODO', toUpdate)
      this.editing = false
    },
    editExitTodo() {
      this.content = this.beforeEdit
      this.editing = false
    },
    changeRoute(id) {
      if (this.$router.param === id) {
        return
      }
      this.$router.push(`/${id}`)
    }
  }
}
</script>

<style scoped>
.completed {
  @apply text-gray-500;
  @apply line-through;
}
.svg-icon {
  width: 1em;
  height: 1em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
  fill: red;
}

.svg-icon circle {
  stroke: red;
  stroke-width: 1;
}
</style>
