<script setup>
import _ from "lodash";
import { onMounted, onUnmounted, inject, nextTick, ref, watch } from "vue";
import ContextMenuButton from "./buttons/ContextMenuButton.vue";
import { getNewUntitled } from "@/utils/helpers.js";

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

const deleteFolder = (folders, id, deletedBaseNames) =>
  folders.filter((folder) => {
    if (typeof folder === "string") {
      return true;
    }

    if (folder.name.includes("Untitled")) {
      deletedBaseNames.push(folder.name);
    }

    if (folder.id === id) {
      return false;
    }

    folder.children = deleteFolder(folder.children, id);
    return true;
  });

const onDeleteFolder = async () => {
  const id = contextMenu.value.folderId;
  const deletedBaseNames = [];
  folderList.value = deleteFolder(folderList.value, id, deletedBaseNames);
  baseFolderNames.value = baseFolderNames.value.filter(
    (name) => !deletedBaseNames.includes(name)
  );
  console.log(baseFolderNames.value);
  await chrome.storage.local.set({ folders: folderList });
  contextMenu.value = { ...contextMenu.value, isOpen: false };
};

const createFolder = (folders, id) => {
  baseFolderNames.value.push(getNewUntitled(baseFolderNames.value));
  const name = baseFolderNames.value[baseFolderNames.value.length - 1];
  let newFolderId = 0;

  const updateFolders = (items) => {
    items.forEach((item) => {
      if (typeof item === "string") {
        return;
      }
      if (item.id === id) {
        const newFolder = {
          id: Date.now(),
          type: "folder",
          isOpen: false,
          children: [],
          name,
        };
        item.isOpen = true;
        item.children.unshift(newFolder);
        newFolderId = newFolder.id;
        return;
      }
      updateFolders(item.children, id);
    });
  };
  updateFolders(folders);
  return [folders, newFolderId];
};

const onCreateFolder = async () => {
  const id = contextMenu.value.folderId;
  const [folders, newFolderId] = createFolder(
    _.cloneDeep(folderList.value),
    id
  );
  folderList.value = folders;
  contextMenu.value = {
    ...contextMenu.value,
    isOpen: false,
    folderId: newFolderId,
  };
  isEditingFolderName.value = true;
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
