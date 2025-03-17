<script setup>
import _ from "lodash";
import { onMounted, onUnmounted, inject, nextTick } from "vue";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames.js";
import {
  deleteFolder,
  createFolder,
  deleteChat,
} from "@/background/background.js";
import { handleDeleteChat } from "@/background/observers/deleteChat.js";
import { CHAT_EL_CLASS_NAME } from "@/variables.js";
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
});
const emit = defineEmits(["close"]);
const folderList = inject("folderList");
const chatList = inject("chatList");
const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const showSearchChats = inject("showSearchChats");
const isEditingChatName = inject("isEditingChatName");
const isEditingFolderName = inject("isEditingFolderName");

// Общие функции
const deleteFolderIdFromList = (id) =>
  chatList.value.map((item) =>
    item.id === id ? { ...item, folderId: null } : item
  );
const deleteChatFromList = (id) =>
  chatList.value.filter((item) => item.id !== id);

const onOutsideClick = (event, type) => {
  const contextMenu = document.querySelector(
    `${type === "chat" ? ".cm-chat" : ".cm-folder"}`
  );

  if (contextMenu && !contextMenu.contains(event.target)) {
    emit("close");
  }
};

const onRename = async (type) => {
  if (type === "chat") {
    isEditingChatName.value = true;
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  } else {
    isEditingFolderName.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };
  }
  await nextTick();
  document.querySelector(`.${type}-name__input`).focus();
};

// type: folder
const onDeleteFolder = async () => {
  const id = contextMenu.value.folderId;
  folderList.value = deleteFolder(folderList.value, id);
  chatList.value = chatList.value.map((item) =>
    item.folderId === id ? { ...item, folderId: null } : item
  );
  const baseNames = getBaseFolderNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);
  await chrome.storage.sync.set({ folders: folderList.value });
  await chrome.storage.sync.set({ chats: chatList.value });
  contextMenu.value = { ...contextMenu.value, isOpen: false };
};

const onCreateFolder = async () => {
  const id = contextMenu.value.folderId;
  const [folders, newFolderId, newParentFolderId] = createFolder(
    _.cloneDeep(folderList.value),
    id,
    baseFolderNames.value
  );
  folderList.value = folders;
  chatList.value = chatList.value.map((chat) =>
    chat.folderId === id ? { ...chat, folderId: newParentFolderId } : chat
  );
  const baseNames = getBaseFolderNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);
  contextMenu.value = {
    ...contextMenu.value,
    isOpen: false,
    folderId: newFolderId,
  };
  isEditingFolderName.value = true;
  await chrome.storage.sync.set({ folders });
  await chrome.storage.sync.set({ chats: chatList.value });
  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

const onAddChat = () => {
  showSearchChats.value = true;
  contextMenu.value = { ...contextMenu.value, isOpen: false };
};

// type: chat
const onDelete = async (target) => {
  const chatId = contextMenuChat.value.chatId;
  contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  folderList.value = deleteChat(folderList.value, chatId);
  chatList.value =
    target === "from folder"
      ? deleteFolderIdFromList(chatId)
      : deleteChatFromList(chatId);

  await chrome.storage.sync.set({ folders: folderList.value });
  await chrome.storage.sync.set({ chats: chatList.value });
};

onMounted(async () => document.addEventListener("click", onOutsideClick));
onUnmounted(() => document.removeEventListener("click", onOutsideClick));
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
      <ContextMenuButton name="New folder" @click="onCreateFolder" />
      <div class="line"></div>
      <ContextMenuButton name="Rename" @click="onRename('folder')" />
      <ContextMenuButton name="Delete" @click="onDeleteFolder" />
    </div>
    <div
      v-else
      class="context-menu cm-chat"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <!-- <div class="line"></div> -->
      <ContextMenuButton name="Rename" @click="onRename('chat')" />
      <ContextMenuButton
        name="Delete from folder"
        @click="onDelete('from folder')"
      />
      <ContextMenuButton
        name="Delete"
        @click="handleDeleteChat({ chatList, chatId: contextMenuChat.chatId })"
      />
    </div>
  </transition>
</template>
