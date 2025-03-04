<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  nodeId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:isFolderOpen"]);
const contextMenu = inject("contextMenu");
const folderList = inject("folderList");
const isEditingChatName = inject("isEditingChatName");
const showDots = ref(false);
const inputRef = ref(null);

// const openContextMenu = (event) => {
//   if (contextMenu.value.isOpen) {
//     contextMenu.value = { ...contextMenu.value, isOpen: false };
//     return;
//   }

//   // Получаем координаты кнопки
//   const buttonRect = event.target.getBoundingClientRect();
//   const position = {
//     top: buttonRect.bottom + window.scrollY + 10,
//     left: buttonRect.left + window.scrollX,
//   };
//   contextMenu.value = { isOpen: true, position, folderId: props.id };
// };

// const handleRename = async () => {
// };
</script>

<template>
  <input
    v-if="isEditingChatName && id === contextMenu.folderId"
    ref="inputRef"
    class="chat-name__input"
    type="text"
    name="chat-name"
    :value="name"
    @blur="handleRename"
    @keydown.enter="handleRename"
  />
  <div
    v-else
    class="chat-name"
    :data-id="id"
    @click="toggleFolder"
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
      <IconDots />
    </div>
  </div>
</template>
