<script setup>
const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <transition name="fade">
    <div
      class="notification"
      :styles="`left: ${position.left}; top: ${position.top};`"
    >
      <slot></slot>
    </div>
  </transition>
</template>
