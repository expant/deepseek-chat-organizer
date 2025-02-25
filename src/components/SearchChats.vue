<script setup>
import _ from "lodash";
import { ref, onMounted, inject, computed } from "vue";
import { addChatsToFolder } from "@/background/background.js";
import { getFolderNameById, convertObjToArrDeep } from "@/utils/helpers.js";
import IconSearch from "./icons/IconSearch.vue";
import IconExit from "./icons/IconExit.vue";

const props = defineProps({
  isOpen: Boolean,
  required: true,
});
const emit = defineEmits(["close"]);
const classNamesChats = "c08e6e93";
const chatList = inject("chatList");
const folderList = inject("folderList");
const contextMenu = inject("contextMenu");
const search = ref("");
const selectedChats = ref([]);

const removeEventListeners = () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  searchChatsWrap.removeEventListener("click", onOutsideClick);
  window.removeEventListener("keydown", onKeydown);
  emit("close");
};

const onOutsideClick = (event) => {
  console.log("Здесь");
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  const searchСhats = searchChatsWrap.querySelector(".search-chats");

  if (props.isOpen && !searchСhats.contains(event.target)) {
    removeEventListeners();
  }
};

const onKeydown = (event) => {
  if (event.key !== "Escape") return;
  removeEventListeners();
};

// TODO: Возможно стоит разделить список на два (добавленные в папку и нет)
// TODO: Папка должна открываться после добавления чата/чатов
const onSelectedChats = async (event) => {
  event.stopPropagation();
  const folderId = contextMenu.value.folderId;
  const chats = chatList.value.filter((chat) =>
    selectedChats.value.includes(chat.id)
  );

  const newFolderId = Date.now();
  chatList.value = chatList.value.map((chat) => {
    return selectedChats.value.includes(chat.id) || chat.folderId === folderId
      ? { ...chat, folderId: newFolderId }
      : chat;
  });

  const args = [
    _.cloneDeep(chats),
    _.cloneDeep(folderList.value),
    folderId,
    newFolderId,
  ];

  chatList.value = convertObjToArrDeep(chatList.value, "chats");
  folderList.value = convertObjToArrDeep(addChatsToFolder(...args), "folders");

  console.log("folderList: " + folderList.value);
  await chrome.storage.local.set({ folders: folderList.value });
  await chrome.storage.local.set({ chats: chatList.value });
  onOutsideClick(event);
};

const searchedChats = computed(() => {
  if (!search.value) return chatList.value;
  return chatList.value.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.value.toLowerCase()) &&
      !chat.folderId
  );
});

const getFolderName = (id) =>
  id ? `folder: ${getFolderNameById(folderList.value, id)}` : "";

onMounted(async () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  const input = searchChatsWrap.querySelector("input[name='search-chats']");
  input.focus();
  searchChatsWrap.addEventListener("click", onOutsideClick);
  window.addEventListener("keydown", onKeydown);
});

// FIXME: Скрывать мешающие элементы за модальным окном Search
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
        <li v-for="chat in searchedChats" :key="chat.id">
          <input
            type="checkbox"
            :id="'chat-' + chat.id"
            :value="chat.id"
            v-model="selectedChats"
          />
          <label :for="'chat-' + chat.id">
            {{ chat.name }}
            <span class="chat-folder-name">
              {{ getFolderName(chat.folderId) }}
            </span>
          </label>
        </li>
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
