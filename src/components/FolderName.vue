<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { isNameNotUnique } from "@/utils/helpers.js";
import { renameFolder } from "@/background.js";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";
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

const handleRename = async () => {
  if (!inputRef.value) return;
  const inputValue = inputRef.value.value.trim();
  const clonedFolders = _.cloneDeep(folderList.value);

  if (isNameNotUnique(clonedFolders, inputValue)) {
    // TODO: Активация showNotification и рендеринг соответствующего компонента
    console.log("Папка с таким именем уже существует");
    isEditingFolderName.value = false;
    return;
  }

  folderList.value = renameFolder(clonedFolders, props.id, inputValue);
  await chrome.storage.local.set({ folders: folderList.value });
  isEditingFolderName.value = false;
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
    <span class="folder-name__text">{{ name }}</span>
    <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
      <IconDots />
    </div>
  </div>
</template>
