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
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const isEditingFolderName = inject("isEditingFolderName");

const handleClickOutside = (event) => {
  const contextMenu = document.querySelector(".context-menu");
  if (contextMenu && !contextMenu.contains(event.target)) {
    emit("close");
  }
};

const onRenameFolder = async () => {
  isEditingFolderName.value = true;
  contextMenu.value = { ...contextMenu.value, isOpen: false };
  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

const deleteFolder = (folders, id) => {
  const index = folders.findIndex((folder) => {
    if (typeof folder === "string") {
      return false;
    }
    return folder.id !== id ? deleteFolder(folder.children, id) : true;
  });

  if (index >= 0) {
    folders.splice(index, 1);
    return true;
  }
  return false;
};

const onDeleteFolder = async () => {
  const id = contextMenu.value.folderId;

  if (deleteFolder(folderList, id)) {
    await chrome.storage.local.set({ folders: folderList });
  } else {
    console.log("Не удалось удалить папку!");
  }
  contextMenu.value = { ...contextMenu.value, isOpen: false };
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
      <ContextMenuButton name="Rename" @click="onRenameFolder" />
      <ContextMenuButton name="Delete" @click="onDeleteFolder" />
    </div>
  </transition>
</template>
