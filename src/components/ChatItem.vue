<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { useChats } from "@/composables/useChats";
import { getDSChatEl } from "@/utils/helpers";
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

const chatStore = useChats(contextMenuChat, isEditingChatName);

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

const openDialog = () => {
  emit("click");
  const el = getDSChatEl(props.chat.name);
  el.click();
};
</script>

<template>
  <div class="chat-wrapper">
    <input
      v-show="isEditingChatName && chat.id === contextMenuChat.chatId"
      ref="inputRef"
      class="chat-name__input"
      type="text"
      name="chat-name"
      :value="chat.name"
      :data-id="chat.id"
      @blur="chatStore.onRename(chat.name, inputRef.value.trim(), chat.id)"
      @keydown.enter="
        chatStore.onRename(chat.name, inputRef.value.trim(), chat.id)
      "
    />
    <div
      v-show="!isEditingChatName || chat.id !== contextMenuChat.chatId"
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
