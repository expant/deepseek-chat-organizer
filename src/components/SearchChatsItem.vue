<script setup>
import { inject, ref, computed, onMounted } from "vue";
import { getFolderNameById } from "@/utils/helpers.js";
import { deleteChat } from "@/utils/chatAndFolderLogic";
import IconReturn from "./icons/IconReturn.vue";
import { every } from "lodash";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  chat: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const folderList = inject("folderList");
const chatList = inject("chatList");
const showIconReturn = ref(false);
const folderName = ref("");

const handleCheckboxChange = (event) => {
  const updatedSelectedChats = event.target.checked
    ? [...props.modelValue, props.chat.id]
    : props.modelValue.filter((id) => id !== props.chat.id);
  emit("update:modelValue", updatedSelectedChats);
};

const isChatInFolder = computed(() => {
  const chat = chatList.value.find((item) => item.id === props.chat.id);
  return chat.folderId ? true : false;
});

const onDeleteFromFolder = async () => {
  folderName.value = "";
  chatList.value = chatList.value.map((chat) =>
    props.chat.id === chat.id ? { ...chat, folderId: null } : chat
  );
  folderList.value = deleteChat(folderList.value, props.chat.id);

  await chrome.storage.sync.set({ chats: chatList.value });
  await chrome.storage.sync.set({ folders: folderList.value });
};

const getFolderName = (id) => {
  if (!id) return "";
  const folderName = getFolderNameById(folderList.value, id);
  return folderName ? `${folderName}` : "";
};

onMounted(() => {
  folderName.value = getFolderName(props.chat.folderId);
});
</script>

<template>
  <li @mouseover="showIconReturn = true" @mouseleave="showIconReturn = false">
    <input
      type="checkbox"
      :id="'chat-' + chat.id"
      :value="chat.id"
      :disabled="isChatInFolder"
      @change="handleCheckboxChange"
    />
    <label :for="'chat-' + chat.id">
      <span class="chat-name" :title="chat.name">{{ chat.name }}</span>
      <span v-if="folderName" class="chat-folder-name" :title="folderName">
        {{ folderName }}
      </span>
    </label>
    <span
      class="icon-return-wrap"
      v-show="showIconReturn && isChatInFolder"
      title="Remove from folder"
      @click="onDeleteFromFolder"
    >
      <IconReturn title="" />
    </span>
  </li>
</template>
