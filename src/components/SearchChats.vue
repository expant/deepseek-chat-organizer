<script setup>
import { inject } from "vue";
import { useChats } from "@/composables/useChats";
import { useSearchChats } from "@/composables/useSearchChats";
import SearchChatsItem from "./SearchChatsItem.vue";
import IconSearch from "./icons/IconSearch.vue";
import IconExit from "./icons/IconExit.vue";

const props = defineProps({
  isOpen: Boolean,
  required: true,
});
const emit = defineEmits(["close"]);

const folderMenu = inject("folderMenu");

const { chats } = useChats();
const { onSelected, selected, filteredChatsByQuery, searchQuery } =
  useSearchChats(emit);
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
            v-model.trim="searchQuery"
          />
        </div>
        <IconExit @click="removeEventListeners" />
      </div>
      <ul class="search-chats__list">
        <SearchChatsItem
          v-for="chat in filteredChatsByQuery"
          :key="chat.id"
          :chat="chat"
          :chats="chats"
          v-model="selected"
        />
      </ul>
    </div>
    <button
      v-show="selected.length > 0"
      class="search-chats__btn"
      @click="(e) => onSelected(e, folderMenu.folderId)"
    >
      Add chat(s)
    </button>
  </div>
</template>
