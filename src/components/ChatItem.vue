<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { useChats } from "@/composables/useChats";
import { getDSChatEl } from "@/utils/helpers";
import ContextMenu from "./ContextMenu/ContextMenu.vue";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["click"]);

const chatMenu = inject("chatMenu");
const folderMenu = inject("folderMenu");
const isEditingChatName = inject("isEditingChatName");

const showDots = ref(false);
const inputRef = ref(null);
const chatRef = ref(null);

const chatStore = useChats(chatMenu, isEditingChatName);

const openContextMenu = () => {
  if (folderMenu.value.isOpen) {
    folderMenu.value = { ...folderMenu.value, isOpen: false };
  }
  if (chatMenu.value.isOpen) {
    chatMenu.value = { ...chatMenu.value, isOpen: false };
    return;
  }
  chatMenu.value = {
    ...chatMenu.value,
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
      v-show="isEditingChatName && chat.id === chatMenu.chatId"
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
      v-show="!isEditingChatName || chat.id !== chatMenu.chatId"
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
      v-show="chatMenu.isOpen"
      @close="chatMenu.isOpen = false"
      :type="'chat'"
      :position="chatMenu.position"
      :target-el="chatRef"
    />
  </div>
</template>
