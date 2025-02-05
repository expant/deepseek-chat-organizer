<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const handleClickOutside = (event) => {
  const contextMenu = document.querySelector(".context-menu");
  if (contextMenu && !contextMenu.contains(event.target)) {
    emit("close");
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="context-menu"
    :style="{
      top: `${position.top}px`,
      left: `${position.left}px`,
  }">
    <button>Rename</button>
    <button>Delete</button>
  </div>
</template>
