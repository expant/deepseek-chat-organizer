<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { isNameNotUnique } from "@/utils/helpers.js";
import { renameFolder } from "@/utils/chatAndFolderLogic";
import ContextMenu from "./ContextMenu.vue";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update:isFolderOpen"]);
const folderRef = ref(null);
const inputRef = ref(null);
const showDots = ref(false);
const showNotification = ref(false);
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const isEditingFolderName = inject("isEditingFolderName");

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);
const openContextMenu = (event) => {
  if (contextMenuChat.value.isOpen) {
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  }
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    return;
  }
  contextMenu.value = {
    ...contextMenu.value,
    isOpen: true,
    folderId: props.id,
  };
};

const handleRename = async () => {
  if (!inputRef.value) return;
  const inputValue = inputRef.value.value.trim();
  const clonedFolders = _.cloneDeep(folderList.value);

  if (isNameNotUnique(clonedFolders, inputValue)) {
    // TODO: Активация showNotification и рендеринг соответствующего компонента
    isEditingFolderName.value = false;
    return;
  }
  folderList.value = renameFolder(clonedFolders, props.id, inputValue);
  await chrome.storage.sync.set({ folders: folderList.value });
  isEditingFolderName.value = false;
};
</script>
<template>
  <div class="folder-wrapper">
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
      ref="folderRef"
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
    <ContextMenu
      v-show="contextMenu.isOpen"
      @close="contextMenu.isOpen = false"
      :type="'folder'"
      :position="contextMenu.position"
      :target-el="folderRef"
    />
  </div>
</template>
