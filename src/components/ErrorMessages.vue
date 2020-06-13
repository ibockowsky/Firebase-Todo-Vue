<template>
  <div>
    <transition-group name="slide-up" tag="ul" appear>
      <li v-for="error in errors" :key="error">
        <span class="text-xs text-red-400 py-1 ">
          {{ error }}
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.slide-up-enter {
  transform: translateY(10px);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.2s ease;
}

.slide-up-move {
  transition: transform 0.8s ease-in;
}
</style>
