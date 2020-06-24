<template>
  <div class="bg-gray-100 shadow-md rounded  p-2 w-1/2 mx-auto">
    <div class="overflow-auto h-64 py-1">
      <div class="flex justify-between text-sm text-gray-500 px-3">
        <div>Title</div>
        <div>Deleted at</div>
      </div>
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="flex justify-between text-sm text-gray-500 px-3"
      >
        <div>{{ todo.content }}</div>
        <div>
          {{
            todo.deleted_at instanceof Date
              ? todo.deleted_at
              : todo.deleted_at.toDate() | formatDate
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todos: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped></style>
