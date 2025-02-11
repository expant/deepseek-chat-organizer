<script setup>
import { ref, computed, inject, watch, nextTick, onMounted } from "vue";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";
import ContextMenu from "./ContextMenu.vue";

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

const rename = (folders, inputValue) =>
  folders.map((folder) => {
    if (typeof folder === "string") {
      return folder;
    }

    if (props.id !== folder.id) {
      folder.children = rename(folder.children, inputValue);
      return folder;
    }

    if (folder.name !== inputValue && inputValue) {
      return { ...folder, name: inputValue };
    }
    return folder;
  });

const handleRename = async () => {
  const inputValue = inputRef.value.value.trim();
  const lastUntitled = baseFolderNames.value.at(-1);
  if (lastUntitled !== inputValue) {
    baseFolderNames.value = baseFolderNames.value.slice(0, -1);
  }

  folderList.value = rename(folderList.value, inputValue);
  await chrome.storage.local.set({ folders: folderList.value });
  isEditingFolderName.value = false;
};
</script>

<template>
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
