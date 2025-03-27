<script setup>
import { computed } from "vue";

const arrowDirection = { down: "rotate(90deg)", right: "rotate(0deg)" };
const props = defineProps({
  isFolderOpen: { type: Boolean, required: true },
});

const rotationStyles = computed(() => ({
  transform: props.isFolderOpen ? arrowDirection.down : arrowDirection.right,
}));
</script>

<template>
  <svg
    :style="rotationStyles"
    class="icon-arrow"
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 7L15 12L10 17"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
