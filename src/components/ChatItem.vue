<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { renameChat } from "@/background/background.js";
import { CHAT_EL_CLASS_NAME } from "@/variables.js";
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

const renameDSChat = (prevName, newName) => {
  const menuClassname = "ds-floating-position-wrapper";
  const renameBtnClassName = "ds-dropdown-menu-option--none";
  const inputClassName = "ds-input__input";

  const cb = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        !mutation.addedNodes[0] &&
        !mutation.target.classList.contains(menuClassname)
      )
        return;

      const el1 = mutation.addedNodes[0];
      const el2 = mutation.target;
      const isMenuEl1 = el1.classList.contains(menuClassname);
      // const isMenuEl2 = el2.classList.contains(menuClassname);
      const menuEl = isMenuEl1 ? el1 : el2;
      const renameBtn = menuEl.querySelector(`.${renameBtnClassName}`);
      renameBtn.click();

      setTimeout(() => {
        const input = document.querySelector(
          `input.${inputClassName}[value="${prevName}"]`
        );
        input.value = newName;
        input.blur();
      }, 100);
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(cb);
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  const elements = document.querySelectorAll(CHAT_EL_CLASS_NAME);
  elements.forEach((el) => {
    if (el.textContent !== prevName) return;
    const dotsEl = el.nextElementSibling;
    dotsEl.click();
  });
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

  chatList.value = chatList.value.map((item) =>
    item.id === props.chat.id ? { ...item, name: inputValue } : item
  );
  folderList.value = renameChat(folderList.value, props.chat.id, inputValue);
  renameDSChat(prevName, inputValue);

  await chrome.storage.local.set({ chats: chatList.value });
  await chrome.storage.local.set({ folders: folderList.value });

  isEditingChatName.value = false;
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
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <span class="chat-name">{{ chat.name }}</span>
    <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
      <IconDots />
    </div>
  </div>
</template>
