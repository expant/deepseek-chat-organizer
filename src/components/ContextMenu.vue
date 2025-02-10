<script setup>
import _ from 'lodash';
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

const createFolder = (folders, id) => {
  const addNewUntitled = (arr) => {
    const nums = arr.map((item) => {
      const match = item.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });

    let missingNum = 0;
    while (nums.includes(missingNum)) {
      missingNum += 1;
    }

    return missingNum ? `Untitled ${missingNum}` : 'Untitled';
  };

  if (baseFolderNames.value.length === 0) {
    baseFolderNames.value.push('Untitled');  
  } else {
    baseFolderNames.value.push(addNewUntitled(baseFolderNames.value))
  }

  const name = baseFolderNames.value[baseFolderNames.value.length - 1];
  let newFolderId = 0;

  folders.forEach((folder) => {
    if (typeof folder === "string") {
      return;
    }
    if (folder.id === id) {
      const newFolder = {
        id: Date.now(),
        type: "folder",
        isOpen: false,
        children: [],
        name,
      };
      folder.isOpen = true;
      folder.children.push(newFolder);
      newFolderId = newFolder.id;
      return;
    }
    folder.children = createFolder(folder.children, id);
  });

  return [folders, newFolderId];
};

const onCreateFolder = async () => {
  const id = contextMenu.value.folderId;
  const [folders, newFolderId] = createFolder(_.cloneDeep(folderList.value), id);

  folderList.value = folders;
  // contextMenu.value = { ...contextMenu.value, isOpen: false, folderId: newFolderId };

  console.log(folderList.value, newFolderId);

  // console.log(folders, newFolderId);
  // console.log(folderList.value, newFolderId);
  // isEditingFolderName.value = true;
  // await nextTick();
  // document.querySelector(".folder-name__input").focus();
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
