<script setup>
import { ref, onMounted, inject, computed } from "vue";
import IconSearch from "./icons/IconSearch.vue";
import IconExit from "./icons/IconExit.vue";

const props = defineProps({
  isOpen: Boolean,
  required: true,
});
const emit = defineEmits(["close"]);
const classNamesChats = "c08e6e93";
const chatList = inject("chatList");
const search = ref("");
const selectedChats = ref([]);

const removeEventListeners = () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  searchChatsWrap.removeEventListener("click", onOutsideClick);
  window.removeEventListener("keydown", onKeydown);
  emit("close");
};

const onOutsideClick = (event) => {
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

const onSelectedChats = () => {
  console.log(selectedChats.value);
};

const searchedChats = computed(() => {
  if (!search.value) return chatList.value;
  return chatList.value.filter((chat) =>
    chat.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(async () => {
  const searchChatsWrap = document.querySelector(".search-chats-wrap");
  const input = searchChatsWrap.querySelector("input[name='search-chats']");
  input.focus();
  searchChatsWrap.addEventListener("click", onOutsideClick);
  window.addEventListener("keydown", onKeydown);
});

// FIXME: Скрывать мешающиеся элементы за модальным окном Search
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
          <label :for="'chat-' + chat.id">{{ chat.name }}</label>
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
