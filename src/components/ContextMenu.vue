<script setup>
import _ from "lodash";
import { inject, nextTick, watch } from "vue";
import { isOutsideClick } from "@/utils/helpers";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames.js";
import {
  deleteFolder,
  createFolder,
  deleteChat,
} from "@/utils/chatAndFolderLogic";
import { handleChatDeletion } from "@/content_scripts/dom/handlers";
import { setObservationType } from "@/content_scripts/dom/state";
import { classNames } from "@/variables.js";
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
const folderList = inject("folderList");
const chatList = inject("chatList");
const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const showSearchChats = inject("showSearchChats");
const isEditingChatName = inject("isEditingChatName");
const isEditingFolderName = inject("isEditingFolderName");
const scrollContainer = document.querySelector(`.${classNames.CHAT_LIST}`);

// Общие функции
const deleteFolderIdFromList = (id) =>
  chatList.value.map((item) =>
    item.id === id ? { ...item, folderId: null } : item
  );
const deleteChatFromList = (id) =>
  chatList.value.filter((item) => item.id !== id);

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

//type: chat
const onDeleteChatFromFolder = async (target) => {
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

const onDeleteChat = async () => {
  const chatId = contextMenuChat.value.chatId;
  setObservationType("deleteFromFolder");
  await handleChatDeletion(chatId);
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
        @click="onDeleteChatFromFolder('from folder')"
      />
      <ContextMenuButton name="Delete" @click="onDeleteChat" />
    </div>
  </transition>
</template>
