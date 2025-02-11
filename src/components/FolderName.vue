<script setup>
import { ref, computed, inject, watch, nextTick, onMounted } from "vue";
import _ from "lodash";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";
import ContextMenu from "./ContextMenu.vue";
// import BaseNotification from "./BaseNotification.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isFolderOpen"]);
const contextMenu = inject("contextMenu");
const folderList = inject("folderList");
const isEditingFolderName = inject("isEditingFolderName");
const baseFolderNames = inject("baseFolderNames");
const showDots = ref(false);
const inputRef = ref(null);
const showNotification = ref(false);

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);
const openContextMenu = (event) => {
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    return;
  }

  // Получаем координаты кнопки
  const buttonRect = event.target.getBoundingClientRect();
  const position = {
    top: buttonRect.bottom + window.scrollY + 10,
    left: buttonRect.left + window.scrollX,
  };
  contextMenu.value = { isOpen: true, position, folderId: props.id };
};

const isNameNotUnique  = (items, id, name) => items.some((item) => {
  if (typeof item === 'string') return false;
  if (item.name === name) return item.id === id ? false : true;
  if (item.children) return isNameNotUnique(item.children, id, name);
});

const rename = (items, id, name) => items.map((item) => {
  if (typeof item === 'string') return item;
  if (id !== item.id) {
    if (item.children) return { ...item, children: rename(item.children, id, name) };
    return item;
  }
  if (item.name !== name && name) return { ...item, name };
  return item;
});

const handleRename = async (event) => {
  // const lastUntitled = baseFolderNames.value.at(-1);
  const inputValue = inputRef.value.value.trim();
  const clonedFolders = _.cloneDeep(folderList.value);

  if (isNameNotUnique(clonedFolders, props.id, inputValue)) {
    // baseFolderNames.value = 
    console.log('Папка с таким именем уже существует');
  } else {
    folderList.value = rename(clonedFolders, props.id, inputValue);
  }
  await chrome.storage.local.set({ folders: folderList.value });
  isEditingFolderName.value = false;
  
  // if (lastUntitled !== inputValue) {
  //   baseFolderNames.value = baseFolderNames.value.slice(0, -1);
  // }

};
</script>

<template>
  <!-- <base-notification class="noti" v-if="showNotification">There's already a folder with the same name</base-notification> -->
  <input
    v-if="isEditingFolderName && id === contextMenu.folderId"
    ref="inputRef"
    class="folder-name__input"
    type="text"
    name="folder-name"
    :value="name"
    @blur="handleRename"
    @keydown.enter="handleRename"
  />
  <div
    v-else
    class="folder-name"
    :data-id="id"
    @click="toggleFolder"
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <IconArrow :isFolderOpen="isFolderOpen" />
    <span class="folder-name__text">{{ props.name }}</span>
    <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
      <IconDots />
    </div>
  </div>
</template>
