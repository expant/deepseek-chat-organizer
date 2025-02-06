<script setup>
import { onMounted, onUnmounted, inject, nextTick } from "vue";
import ContextMenuButton from "./buttons/ContextMenuButton.vue";

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const contextMenu = inject("contextMenu");
const setContextMenu = inject("setContextMenu");
const isEditingFolderName = inject("isEditingFolderName");
const setEditingFolderName = inject("setEditingFolderName");

const handleClickOutside = (event) => {
  const contextMenu = document.querySelector(".context-menu");
  if (contextMenu && !contextMenu.contains(event.target)) {
    emit("close");
  }
};

const renameFolder = async () => {
  setEditingFolderName(true);
  setContextMenu({ ...contextMenu.value, isOpen: false });
  await nextTick();
  document.querySelector('.folder-name__input').focus();
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <transition name="fade">
    <div
      class="context-menu"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <ContextMenuButton name="Rename" @click="renameFolder" />
      <ContextMenuButton name="Delete" />
    </div>
  </transition>
</template>
