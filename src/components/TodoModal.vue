<template>
  <div
    class="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
    tabindex="0"
  >
    <div class="fixed inset-0 transition-opacity">
      <div
        class="absolute inset-0 bg-gray-500 opacity-75"
        @click="closeModal"
      ></div>
    </div>
    <div
      class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg
              class="h-6 w-6 svg-icon text-teal-600"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <path
                fill="none"
                d="M16.588,3.411h-4.466c0.042-0.116,0.074-0.236,0.074-0.366c0-0.606-0.492-1.098-1.099-1.098H8.901c-0.607,0-1.098,0.492-1.098,1.098c0,0.13,0.033,0.25,0.074,0.366H3.41c-0.606,0-1.098,0.492-1.098,1.098c0,0.607,0.492,1.098,1.098,1.098h0.366V16.59c0,0.808,0.655,1.464,1.464,1.464h9.517c0.809,0,1.466-0.656,1.466-1.464V5.607h0.364c0.607,0,1.1-0.491,1.1-1.098C17.688,3.903,17.195,3.411,16.588,3.411z M8.901,2.679h2.196c0.202,0,0.366,0.164,0.366,0.366S11.3,3.411,11.098,3.411H8.901c-0.203,0-0.366-0.164-0.366-0.366S8.699,2.679,8.901,2.679z M15.491,16.59c0,0.405-0.329,0.731-0.733,0.731H5.241c-0.404,0-0.732-0.326-0.732-0.731V5.607h10.983V16.59z M16.588,4.875H3.41c-0.203,0-0.366-0.164-0.366-0.366S3.208,4.143,3.41,4.143h13.178c0.202,0,0.367,0.164,0.367,0.366S16.79,4.875,16.588,4.875zM6.705,14.027h6.589c0.202,0,0.366-0.164,0.366-0.366s-0.164-0.367-0.366-0.367H6.705c-0.203,0-0.366,0.165-0.366,0.367S6.502,14.027,6.705,14.027z M6.705,11.83h6.589c0.202,0,0.366-0.164,0.366-0.365c0-0.203-0.164-0.367-0.366-0.367H6.705c-0.203,0-0.366,0.164-0.366,0.367C6.339,11.666,6.502,11.83,6.705,11.83z M6.705,9.634h6.589c0.202,0,0.366-0.164,0.366-0.366c0-0.202-0.164-0.366-0.366-0.366H6.705c-0.203,0-0.366,0.164-0.366,0.366C6.339,9.47,6.502,9.634,6.705,9.634z"
              ></path>
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              {{ todo.content }}
            </h3>
            <div class="mt-2">
              <span
                v-if="!isEditing"
                @dblclick="editText"
                class="text-sm leading-5 text-gray-500"
              >
                {{ todo.text }}
              </span>
              <input
                type="text"
                v-model="todo.text"
                class="font-sans subpixel-antialiased text-sm border-b border-b-2 border-teal-500"
                @keyup.esc="exitEditText"
                @keyup.enter="doneEditText"
                v-else
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
        </span>
        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            type="button"
            class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click.prevent="closeModal"
          >
            Cancel
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    todoId: {
      type: String,
      required: true
    }
  },
  watch: {
    todoId() {
      this.todo = this.$store.getters['todos/getTodo'](this.todoId)
    }
  },
  data() {
    return {
      todo: this.$store.getters['todos/getTodo'](this.todoId),
      isEditing: false
    }
  },
  methods: {
    closeModal() {
      this.$router.push('/')
    },
    editText() {
      this.beforeEdit = this.todo.text
      this.isEditing = true
    },
    doneEditText() {
      if (this.todo.text.trim() == '') {
        this.todo.text = this.beforeEdit
      }
      let toUpdate = {
        id: this.todo.id,
        content: this.todo.content,
        created_at: this.todo.created_at,
        text: this.todo.text,
        completed: this.todo.completed
      }
      console.log(toUpdate)
      this.$store.dispatch('todos/updateTodo', toUpdate)
      this.isEditing = false
    },
    exitEditText() {
      this.todo.text = this.beforeEdit
      this.isEditing = false
    }
  }
}
</script>

<style scoped></style>
