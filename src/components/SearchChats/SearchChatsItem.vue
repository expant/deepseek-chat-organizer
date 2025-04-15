<script setup>
import { ref, onMounted } from "vue";
import { getFolderNameById } from "@/utils/helpers.js";
import { useChats } from "@/composables/useChats";
import { useFolders } from "@/composables/useFolders";
import IconReturn from "../icons/IconReturn.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  chat: {
    type: Object,
    required: true,
  },
  chats: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const showIconReturn = ref(false);
const folderName = ref("");

const { folders } = useFolders();
const { onDeleteFromFolder, isChatInFolder } = useChats();

const onCheckboxChange = (event) => {
  const updatedSelectedChats = event.target.checked
    ? [...props.modelValue, props.chat.id]
    : props.modelValue.filter((id) => id !== props.chat.id);

  emit("update:modelValue", updatedSelectedChats);
};

const resetAndRemoveFromFolder = async () => {
  folderName.value = "";
  await onDeleteFromFolder(props.chat.id);
};

onMounted(() =>
  setTimeout(() => {
    const folderId = props.chat.folderId;

    if (folderId) {
      folderName.value = getFolderNameById(folders.value, folderId) || "";
    }
  }, 100)
);
</script>

<template>
  <li @mouseover="showIconReturn = true" @mouseleave="showIconReturn = false">
    <input
      type="checkbox"
      :id="'chat-' + chat.id"
      :value="chat.id"
      :disabled="isChatInFolder(chat.id)"
      @change="onCheckboxChange"
    />
    <label :for="'chat-' + chat.id">
      <span class="chat-name" :title="chat.name">{{ chat.name }}</span>
      <span v-if="folderName" class="chat-folder-name" :title="folderName">
        {{ folderName }}
      </span>
    </label>
    <span
      class="icon-return-wrap"
      v-show="showIconReturn && isChatInFolder(chat.id)"
      title="Remove from folder"
      @click="resetAndRemoveFromFolder"
    >
      <IconReturn title="" />
    </span>
  </li>
</template>
