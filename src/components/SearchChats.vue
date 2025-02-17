<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import IconSearch from "./icons/IconSearch.vue";
import IconExit from "./icons/IconExit.vue";

const props = defineProps({
  isOpen: Boolean,
  required: true,
});
const emit = defineEmits(["close"]);
const classNamesChats = "c08e6e93";
let searchChatsWrap = ref(null);

const onOutsideClick = (event) => {
  const searchСhats = searchChatsWrap.value.querySelector(".search-chats");
  if (props.isOpen && !searchСhats.contains(event.target)) {
    emit("close");
  }
};

onMounted(async () => {
  searchChatsWrap.value = document.querySelector(".search-chats-wrap");
  const input = searchChatsWrap.querySelector("input[name='search-chats']");
  input.focus();
  searchChatsWrap.value.addEventListener("click", onOutsideClick);
});
onUnmounted(() =>
  searchChatsWrap.value.removeEventListener("click", onOutsideClick)
);
</script>

<template>
  <div class="search-chats-wrap">
    <div class="search-chats">
      <div class="search-chats__header">
        <IconSearch class="search-chats__icon" />
        <div class="search-chats__input">
          <label for="search-chats"></label>
          <input type="text" name="search-chats" id="search-chats" />
        </div>
        <IconExit @click="emit('close')" />
      </div>
      <ul class="search-chats__list"></ul>
    </div>
  </div>
</template>
