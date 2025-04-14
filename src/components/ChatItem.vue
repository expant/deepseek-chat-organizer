<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { useChats } from "@/composables/useChats";
import { useContextMenuState } from "@/composables/useContextMenuState";
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
const isEditingChatName = inject("isEditingChatName");

const showDots = ref(false);
const inputRef = ref(null);
const chatRef = ref(null);

const chatStore = useChats();
const { open } = useContextMenuState();

const openDialog = () => {
  emit("click");
  const el = getDSChatEl(props.chat.name);
  el.click();
};
</script>

<template>
  <div class="chat-wrapper">
    <input
      v-show="isEditingChatName && chat.id === chatMenu.id"
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
      v-show="!isEditingChatName || chat.id !== chatMenu.id"
      ref="chatRef"
      :class="`${chat.isActive ? 'chat-item chat-active' : 'chat-item'}`"
      :data-id="chat.id"
      :title="chat.name"
      @click="openDialog"
      @mouseover="showDots = true"
      @mouseleave="showDots = false"
    >
      <span class="chat-name">{{ chat.name }}</span>
      <div
        class="icon-dots"
        v-show="showDots"
        @click.stop="open('chat', chat.id)"
      >
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
