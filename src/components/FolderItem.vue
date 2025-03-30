<script setup>
import _ from "lodash";
import { ref, inject, onMounted, onUnmounted } from "vue";
import { isNameNotUnique } from "@/utils/helpers.js";
import { renameFolder } from "@/utils/chatAndFolderLogic";
import { classNames } from "@/variables.js";
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
const chatRef = ref(null);
const inputRef = ref(null);
const showDots = ref(false);
const showNotification = ref(false);
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const isEditingFolderName = inject("isEditingFolderName");
const scrollContainer = document.querySelector(`.${classNames.CHAT_LIST}`);

const setPositions = () => {
  const rect = chatRef.value.getBoundingClientRect();
  const position = {
    top: rect.top + rect.height,
    left: rect.right - rect.height,
  };
  contextMenu.value = { ...contextMenu.value, position };
};

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);
const openContextMenu = (event) => {
  if (contextMenuChat.value.isOpen) {
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  }
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    return;
  }
  contextMenu.value = { ...contextMenu.value, isOpen: true, folderId: props.id };
  setPositions();
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

onMounted(() => scrollContainer.addEventListener("scroll", setPositions));
onUnmounted(() => {
  scrollContainer.removeEventListener("scroll", setPositions);
});
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
    ref="chatRef"
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
    <!-- TODO: Переместить вызов ContextMenu из App сюда -->
  </div>
</template>
