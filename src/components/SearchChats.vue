<script setup>
import _ from "lodash";
import { ref, onMounted, inject, computed } from "vue";
import { addChatsToFolder } from "@/utils/chatAndFolderLogic";
import {
  convertObjToArrDeep,
  generateId,
  isOutsideClick,
} from "@/utils/helpers.js";
import SearchChatsItem from "./SearchChatsItem.vue";
import IconSearch from "./icons/IconSearch.vue";
import IconExit from "./icons/IconExit.vue";

const props = defineProps({
  isOpen: Boolean,
  required: true,
});
const emit = defineEmits(["close"]);
const chatList = inject("chatList");
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const search = ref("");
const selectedChats = ref([]);

const removeEventListeners = () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  searchChatsWrap.removeEventListener("click", isOutsideClick);
  window.removeEventListener("keydown", onKeydown);
  emit("close");
};

const onKeydown = (event) => {
  if (event.key !== "Escape") return;
  removeEventListeners();
};

const onSelectedChats = async (event) => {
  event.stopPropagation();
  if (!isOutsideClick(event, ".search-chats")) {
    removeEventListeners();
  }

  const folderId = contextMenu.value.folderId;
  const chats = chatList.value.filter((chat) =>
    selectedChats.value.includes(chat.id)
  );

  const newFolderId = generateId();
  const args = [
    _.cloneDeep(chats),
    _.cloneDeep(folderList.value),
    folderId,
    newFolderId,
  ];

  folderList.value = addChatsToFolder(...args);
  chatList.value = chatList.value.map((chat) => {
    return selectedChats.value.includes(chat.id) || chat.folderId === folderId
      ? { ...chat, folderId: newFolderId }
      : chat;
  });

  await chrome.storage.sync.set({ folders: folderList.value });
  await chrome.storage.sync.set({ chats: chatList.value });
};

const searchedChats = computed(() => {
  if (!search.value) return chatList.value;
  return chatList.value.filter((chat) => {
    const chatName = chat.name.toLowerCase();
    const searchValue = search.value.toLowerCase();
    return chatName.includes(searchValue);
  });
});

onMounted(async () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  const input = searchChatsWrap.querySelector("input[name='search-chats']");
  input.focus();
  searchChatsWrap.addEventListener("click", (event) => {
    if (isOutsideClick(event, ".search-chats")) return;
    removeEventListeners();
  });
  window.addEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="search-chats-wrap">
    <div class="search-chats">
      <div class="search-chats__header">
        <IconSearch class="search-chats__icon" />
        <div class="search-chats__input">
          <label for="search-chats"></label>
          <input
            type="text"
            name="search-chats"
            id="search-chats"
            placeholder="Search chat"
            v-model.trim="search"
          />
        </div>
        <IconExit @click="removeEventListeners" />
      </div>
      <ul class="search-chats__list">
        <SearchChatsItem
          v-for="chat in searchedChats"
          :key="chat.id"
          :chat="chat"
          v-model="selectedChats"
        />
      </ul>
    </div>
    <button
      v-show="selectedChats.length > 0"
      class="search-chats__btn"
      @click="onSelectedChats"
    >
      Add chat(s)
    </button>
  </div>
</template>
