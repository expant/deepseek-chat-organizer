<script setup>
import _ from "lodash";
import { inject, ref, computed, onMounted } from "vue";
import { getFolderNameById } from "@/utils/helpers.js";
import { deleteChat } from "@/utils/chatAndFolderLogic";
import { useStorage } from "@/composables/useStorage";
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

const showIconReturn = ref(false);
const folderName = ref("");

const { data: folders, update: setFolders } = useStorage("folders", []);
const { data: chats, update: setChats } = useStorage("chats", []);

const handleCheckboxChange = (event) => {
  const updatedSelectedChats = event.target.checked
    ? [...props.modelValue, props.chat.id]
    : props.modelValue.filter((id) => id !== props.chat.id);

  emit("update:modelValue", updatedSelectedChats);
};

const isChatInFolder = computed(() => {
  const chat = chats.value.find((item) => item.id === props.chat.id);
  return !!chat.folderId;
});

const onDeleteFromFolder = async () => {
  folderName.value = "";

  const newChats = chats.value.map((chat) =>
    props.chat.id === chat.id ? { ...chat, folderId: null } : chat
  );

  const clonedFolders = _.cloneDeep(folders.value);
  const newFolders = deleteChat(clonedFolders, props.chat.id);

  await setChats(newChats);
  await setFolders(newFolders);
};

const getFolderName = (id) => {
  if (!id) return "";

  const folderName = getFolderNameById(folders.value, id);
  return folderName ? `${folderName}` : "";
};

onMounted(() => {
  setTimeout(() => {
    folderName.value = getFolderName(props.chat.folderId);
  }, 100);
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
