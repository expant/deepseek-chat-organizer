<script setup>
import { ref, computed, inject, watch, nextTick } from "vue";
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
const setContextMenu = inject("setContextMenu");
const setEditingFolderName = inject("setEditingFolderName");
const showDots = ref(false);
const inputRef = ref(null);

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);
const openContextMenu = (event) => {
  if (contextMenu.value.isOpen) {
    setContextMenu({ ...contextMenu.value, isOpen: false });
    return;
  }

  // Получаем координаты кнопки
  const buttonRect = event.target.getBoundingClientRect();
  const position = {
    top: buttonRect.bottom + window.scrollY + 10,
    left: buttonRect.left + window.scrollX,
  };
  setContextMenu({ isOpen: true, position, folderId: props.id });
};

const handleRename = async () => {
  // const result = await chrome.storage.local.get('folders');
  const inputValue = inputRef.value.value.trim();

  const rename = (items) => {
    let renamed = false;

    items.some((item) => {
      if (!item?.children) {
        return false;
      }

      if (props.id !== item.id) {
        return rename(item.children);
      }

      if (item.name !== inputValue && inputValue) {
        item.name = inputValue;
        renamed = true;
      }
      return true;
    });
    return renamed;
  };

  if (rename(folderList)) {
    await chrome.storage.local.set({ folders: folderList });
  }
  setEditingFolderName(false);
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
