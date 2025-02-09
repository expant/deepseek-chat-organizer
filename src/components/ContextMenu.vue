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

const onOutsideClick = (event) => {
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

const deleteFolder = (folders, id) => folders.filter((folder) => {
  if (typeof folder === "string") {
    return true;
  }
  if (folder.id === id) {
    return false;
  }

  folder.children = deleteFolder(folder.children, id);
  return true;
});

const onDeleteFolder = async () => {
  const id = contextMenu.value.folderId;
  folderList.value = deleteFolder(folderList.value, id);
  await chrome.storage.local.set({ folders: folderList });
  contextMenu.value = { ...contextMenu.value, isOpen: false };
};

onMounted(() => document.addEventListener("click", onOutsideClick));
onUnmounted(() => document.removeEventListener("click", onOutsideClick));
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
