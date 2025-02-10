<script setup>
import { onMounted, onUnmounted, inject, nextTick, ref, watch } from "vue";
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
const baseFolderNames = inject("baseFolderNames");

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

const deleteFolder = (folders, id) =>
  folders.filter((folder) => {
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

// const createFolder = (folders, id) => {
//   // Здесь должен находится код для проверки
//   // folder.name - 'Untitled, Untitled 1, Untitled 2, ...'
//   const name =

//   // folders.forEach((folder) => {
//   //   if (typeof folder === "string") {
//   //     return;
//   //   }
//   //   if (folder.id === id) {
//   //     folder.children.push({
//   //       id: Date.now(),
//   //       type: "folder",
//   //       name: "Untitled",
//   //       isOpen: false,
//   //       children: [],
//   //     });
//   //     return;
//   //   }
//   //   folder.children = createFolder(folder.children, id);
//   // });
// };

const onCreateFolder = async () => {
  const id = contextMenu.value.folderId;
  folderList.value = createFolder(folderList.value, id);
  isEditingFolderName.value = true;
  contextMenu.value = { ...contextMenu.value, isOpen: false };
  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

onMounted(async () => document.addEventListener("click", onOutsideClick));
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
      <ContextMenuButton name="New folder" @click="onCreateFolder" />
      <div class="line"></div>
      <ContextMenuButton name="Rename" @click="onRenameFolder" />
      <ContextMenuButton name="Delete" @click="onDeleteFolder" />
    </div>
  </transition>
</template>
