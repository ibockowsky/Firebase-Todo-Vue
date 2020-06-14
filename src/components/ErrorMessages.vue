<template>
  <div>
    <transition-group name="slide-up" tag="ul" appear>
      <div v-for="error in errors" :key="error">
        <Alert :alert_data="error" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'
export default {
  components: {
    Alert
  },
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
