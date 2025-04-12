<script setup>
import _ from "lodash";
import { inject, watch } from "vue";
import { isOutsideClick } from "@/utils/helpers";
import { classNames } from "@/variables.js";
import { useFolders } from "@/composables/useFolders";
import { useChats } from "@/composables/useChats";
import ContextMenuButton from "./buttons/ContextMenuButton.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
  targetEl: {
    type: HTMLElement,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const showSearchChats = inject("showSearchChats");
const isEditingChatName = inject("isEditingChatName");
const isEditingFolderName = inject("isEditingFolderName");

const scrollContainer = document.querySelector(`.${classNames.CHAT_LIST}`);

const folderStore = useFolders(
  baseFolderNames,
  contextMenu,
  isEditingFolderName
);
const chatStore = useChats(contextMenuChat, isEditingChatName);

const onAddChat = () => {
  showSearchChats.value = true;
  contextMenu.value = { ...contextMenu.value, isOpen: false };
};

const setPositions = () => {
  const rect = props.targetEl.getBoundingClientRect();
  const position = {
    top: rect.top + rect.height,
    left: rect.right - rect.height,
  };

  if (props.type === "chat") {
    contextMenuChat.value = { ...contextMenuChat.value, position };
    return;
  }
  contextMenu.value = { ...contextMenu.value, position };
};

const getActiveContextMenuState = () =>
  props.type === "chat"
    ? contextMenuChat.value.isOpen
    : contextMenu.value.isOpen;

const handleDocumentClick = (event) => {
  const selector = `${props.type === "chat" ? ".cm-chat" : ".cm-folder"}`;
  if (isOutsideClick(event, selector)) return;
  emit("close");
};

const closeMenuAndRemoveFromFolder = async () => {
  const id = contextMenuChat.value.chatId;

  contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  await chatStore.onDeleteFromFolder(id);
};

watch(getActiveContextMenuState, (isOpen) => {
  const id = props.targetEl?.dataset.id || null;

  const wrongEl =
    (props.type === "chat" && id !== contextMenuChat.value.chatId) ||
    (props.type === "folder" && id !== contextMenu.value.folderId);

  if (wrongEl) return;

  if (isOpen) {
    setPositions();
    scrollContainer.addEventListener("scroll", setPositions);
    document.addEventListener("click", handleDocumentClick);
    return;
  }

  scrollContainer.removeEventListener("scroll", setPositions);
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="type === 'folder'"
      class="context-menu cm-folder"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <ContextMenuButton name="Add chat(s)" @click="onAddChat" />
      <ContextMenuButton
        name="New folder"
        @click="folderStore.onCreate('context-menu')"
      />
      <div class="line"></div>
      <ContextMenuButton name="Rename" @click="folderStore.prepareForRename" />
      <ContextMenuButton name="Delete" @click="folderStore.onDelete" />
    </div>
    <div
      v-else
      class="context-menu cm-chat"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <ContextMenuButton name="Rename" @click="chatStore.prepareForRename" />
      <ContextMenuButton
        name="Delete from folder"
        @click="closeMenuAndRemoveFromFolder"
      />
      <ContextMenuButton name="Delete" @click="chatStore.onDelete" />
    </div>
  </transition>
</template>
