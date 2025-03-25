<script setup>
const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="notification"
    :style="`left: ${position.left}; top: ${position.top};`"
  >
    <slot></slot>
  </div>
</template>
