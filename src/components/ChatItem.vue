<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { classNames } from "@/variables";
import { renameChat } from "@/utils/chatAndFolderLogic";
import { renameDSChat } from "@/content_scripts/dom/handlers";
import { getDSChatEl, simulateContextMenuAction } from "@/utils/helpers";
import { setObservationType, setNames } from "@/content_scripts/dom/state";
import { useStorage } from "@/composables/useStorage";

import ContextMenu from "./ContextMenu.vue";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["click"]);

const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const isEditingChatName = inject("isEditingChatName");

const showDots = ref(false);
const inputRef = ref(null);
const chatRef = ref(null);

const { data: folders, update: setFolders } = useStorage("folders", []);
const { data: chats, update: setChats } = useStorage("chats", []);

const openContextMenu = () => {
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
  }
  if (contextMenuChat.value.isOpen) {
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
    return;
  }
  contextMenuChat.value = {
    ...contextMenuChat.value,
    isOpen: true,
    chatId: props.chat.id,
  };
};

const handleRename = async () => {
  if (!inputRef.value) return;
  const prevName = props.chat.name;
  const inputValue = inputRef.value.value.trim();
  const chatName = chats.value.some((item) => item.name === inputValue);

  if (chatName) {
    isEditingChatName.value = false;
    return;
  }

  setObservationType("renameFromFolder");

  const newChats = chats.value.map((item) =>
    item.id === props.chat.id ? { ...item, name: inputValue } : item
  );
  const newFolders = renameChat(folders.value, props.chat.id, inputValue);

  await setChats(newChats);
  await setFolders(newFolders);

  setNames(prevName, inputValue);

  const el = getDSChatEl(prevName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();

  setTimeout(() => {
    simulateContextMenuAction(classNames.RENAME_BTN);
    renameDSChat();
  }, 100);
  isEditingChatName.value = false;
};

const openDialog = () => {
  emit("click");
  const el = getDSChatEl(props.chat.name);
  el.click();
};
</script>

<template>
  <div class="chat-wrapper">
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
      ref="chatRef"
      :class="`${chat.isActive ? 'chat-item chat-active' : 'chat-item'}`"
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
    <ContextMenu
      v-show="contextMenuChat.isOpen"
      @close="contextMenuChat.isOpen = false"
      :type="'chat'"
      :position="contextMenuChat.position"
      :target-el="chatRef"
    />
  </div>
</template>
