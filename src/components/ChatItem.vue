<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { classNames } from "@/variables";
import { renameChat } from "@/utils/chatAndFolderLogic";
import { renameDSChat } from "@/content_scripts/dom/handlers";
import { getDSChatEl, simulateContextMenuAction } from "@/utils/helpers";
import { setObservationType, setNames } from "@/content_scripts/dom/state";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});
const chatList = inject("chatList");
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const isEditingChatName = inject("isEditingChatName");
const showDots = ref(false);
const inputRef = ref(null);

const openContextMenu = (event) => {
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
  }
  if (contextMenuChat.value.isOpen) {
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
    return;
  }

  // Получаем координаты кнопки
  const buttonRect = event.target.getBoundingClientRect();
  const position = {
    top: buttonRect.bottom + window.scrollY + 10,
    left: buttonRect.left + window.scrollX,
  };
  contextMenuChat.value = { isOpen: true, position, chatId: props.chat.id };
};

const handleRename = async () => {
  if (!inputRef.value) return;
  const prevName = props.chat.name;
  const inputValue = inputRef.value.value.trim();
  const chatName = chatList.value.some((item) => item.name === inputValue);

  if (chatName) {
    isEditingChatName.value = false;
    return;
  }

  setObservationType("renameFromFolder");
  chatList.value = chatList.value.map((item) =>
    item.id === props.chat.id ? { ...item, name: inputValue } : item
  );
  folderList.value = renameChat(folderList.value, props.chat.id, inputValue);

  await chrome.storage.sync.set({ chats: chatList.value });
  await chrome.storage.sync.set({ folders: folderList.value });
  setNames(prevName, inputValue);

  const el = getDSChatEl(prevName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();

  setTimeout(() => {
    simulateContextMenuAction(classNames.RENAME_BTN); 
    renameDSChat();
  }, 100)
  isEditingChatName.value = false;
};

const openDialog = () => {
  const el = getDSChatEl(props.chat.name);
  el.click();
};
</script>

<template>
  <input
    v-if="isEditingChatName && chat.id === contextMenuChat.chatId"
    ref="inputRef"
    class="chat-name__input"
    type="text"
    name="chat-name"
    :value="chat.name"
    @blur="handleRename"
    @keydown.enter="handleRename"
  />
  <div
    v-else
    class="chat-item"
    :data-id="chat.id"
    :title="chat.name"
    @click="openDialog"
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <span class="chat-name">{{ chat.name }}</span>
    <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
      <IconDots />
    </div>
  </div>
</template>
