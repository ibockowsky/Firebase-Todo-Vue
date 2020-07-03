<template>
  <div class="bg-gray-100 shadow-md rounded  p-2 w-3/4 md:w-1/2 mx-auto">
    <div class="overflow-auto max-h-64 py-1">
      <template>
        <div class="flex justify-between text-sm text-gray-500 px-3">
          <div class="max-w-1/2">Title</div>
          <div class="max-w-1/2">Deleted at</div>
        </div>
        <loading
          class="vld-parent"
          :active.sync="loadingSpinner"
          :is-full-page="false"
        ></loading>
        <transition-group name="list" tag="div" appear>
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="flex justify-between text-sm text-gray-500 px-3 break-words"
          >
            <div class="max-w-1/2 text-left">
              {{ todo.content }}
            </div>
            <div class="max-w-1/2 text-right">
              {{
                todo.deleted_at instanceof Date
                  ? todo.deleted_at
                  : todo.deleted_at.toDate() | formatDate
              }}
            </div>
          </div>
        </transition-group>
        <div class="text-sm text-gray-500" v-if="todos.length < 1">
          No history.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todos: {
      type: Array,
      required: true
    },
    loadingSpinner: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return { data: [] }
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
