<script setup>
import { ref, computed, inject } from "vue";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";
import ContextMenu from "./ContextMenu.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isFolderOpen"]);
const contextMenu = inject("contextMenu");
const setContextMenu = inject("setContextMenu");
const isEditingFolderName = inject("isEditingFolderName");
const setEditingFolderName = inject("setEditingFolderName");
const showDots = ref(false);

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);

const openContextMenu = (event) => {
  if (contextMenu.value.isOpen) {
    setContextMenu({ ...contextMenu.value, isOpen: false });
    return;
  }

  // Получаем координаты кнопки
  const buttonRect = event.target.getBoundingClientRect();
  const position = {
    top: buttonRect.bottom + window.scrollY + 10,
    left: buttonRect.left + window.scrollX,
  };
  setContextMenu({ isOpen: true, position, folderId: props.id });
};

const onFolderNameEdit = (event) => {
  const folderNameEl = event.target;
  folderNameEl.focus();
  console.log(folderNameEl);
  setEditingFolderName(false);
};
</script>

<template>
  <div
    class="folder-name"
    :data-id="id"
    @click="toggleFolder"
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <IconArrow :isFolderOpen="isFolderOpen" />

    <template v-if="isEditingFolderName && id === contextMenu.folderId">
      <input
        class="folder-name__input"
        type="text"
        :value="name"
        @blur="onFolderNameEdit"
        @keydown.enter="onFolderNameEdit"
      />
    </template>
    <template v-else>
      <span class="folder-name__text">{{ props.name }}</span>
      <div class="icon-dots" v-show="showDots" @click.stop="openContextMenu">
        <IconDots />
      </div>
    </template>
  </div>
</template>
