<script setup>
import { ref } from "vue";
import IconArrow from "./icons/IconArrow.vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["toggleFolder"]);

const isFolderOpen = ref(false);
const rotationStyles = ref({
  transform: isFolderOpen.value ? "rotate(90deg)" : "rotate(0deg)",
});

const toggleFolder = () => {
  isFolderOpen.value = !isFolderOpen.value;
  rotationStyles.value = {
    transform: isFolderOpen.value ? "rotate(90deg)" : "rotate(0deg)",
  };
  emit("toggleFolder");
};
</script>

<template>
  <div class="folder-name" @click="toggleFolder">
    <IconArrow class="icon-arrow" :style="rotationStyles" />
    <span>{{ name }}</span>
  </div>
</template>
