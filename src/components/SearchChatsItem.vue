<script setup>
import { inject, ref, computed, onMounted } from "vue";
import { getFolderNameById } from "@/utils/helpers.js";
import { deleteChatFromFolder } from "@/background/background.js";
import IconReturn from "./icons/IconReturn.vue";

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
  chatList.value = chatList.value.map((chat) =>
    props.chat.id === chat.id ? { ...chat, folderId: null } : chat
  );
  folderList.value = deleteChatFromFolder(folderList.value, props.chat.id);

  await chrome.storage.local.set({ chats: chatList.value });
  await chrome.storage.local.set({ folders: folderList.value });
};

const getFolderName = (id) => {
  if (!id) return "";
  console.log(JSON.stringify(folderList.value));
  const folderName = getFolderNameById(folderList.value, id);
  console.log(folderName);
  return folderName ? `${folderName}` : "";
};

onMounted(() => (folderName.value = getFolderName(props.chat.folderId)));
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
      {{ chat.name }}
      <span v-if="folderName" class="chat-folder-name">
        {{ folderName }}
        <IconReturn v-show="showIconReturn" @click="onDeleteFromFolder" />
      </span>
    </label>
  </li>
</template>
