<script setup>
import { ref, computed } from "vue";
import IconArrow from "./icons/IconArrow.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isFolderOpen']);

const toggleFolder = () => {
  console.log(props.isFolderOpen);
  emit('update:isFolderOpen', !props.isFolderOpen);
};

const rotationStyles = computed(() => ({
  transform: props.isFolderOpen ? "rotate(90deg)" : "rotate(0deg)",
}));
</script>

<template>
  <div class="folder-name" @click="toggleFolder">
    <IconArrow class="icon-arrow" :style="rotationStyles" />
    <span>{{ props.name }}</span>
  </div>
</template>
ё