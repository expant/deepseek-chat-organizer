<script setup>
import _ from "lodash";
import { ref, inject } from "vue";
import { useFolders } from "@/composables/useFolders";
import ContextMenu from "./ContextMenu.vue";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update:isFolderOpen"]);

const contextMenu = inject("contextMenu");
const contextMenuChat = inject("contextMenuChat");
const baseFolderNames = inject("baseFolderNames");
const isEditingFolderName = inject("isEditingFolderName");

const folderStore = useFolders(
  baseFolderNames,
  contextMenu,
  isEditingFolderName
);

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);

const openContextMenu = () => {
  if (contextMenuChat.value.isOpen) {
    contextMenuChat.value = { ...contextMenuChat.value, isOpen: false };
  }
  if (contextMenu.value.isOpen) {
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    return;
  }
  contextMenu.value = {
    ...contextMenu.value,
    isOpen: true,
    folderId: props.id,
  };
};
</script>
<template>
  <div class="folder-wrapper">
    <input
      v-if="isEditingFolderName && id === contextMenu.folderId"
      :ref="folderStore.inputRef"
      class="folder-name__input"
      type="text"
      name="folder-name"
      :value="name"
      @blur="folderStore.onRename"
      @keydown.enter="folderStore.onRename"
    />
    <div
      v-else
      :ref="folderStore.folderRef"
      class="folder-name"
      :data-id="id"
      @click="toggleFolder"
      @mouseover="folderStore.showDots = true"
      @mouseleave="folderStore.showDots = false"
    >
      <IconArrow :isFolderOpen="isFolderOpen" />
      <span class="folder-name__text">{{ name }}</span>
      <div
        class="icon-dots"
        v-show="folderStore.showDots"
        @click.stop="openContextMenu"
      >
        <IconDots />
      </div>
    </div>
    <ContextMenu
      v-show="contextMenu.isOpen"
      @close="contextMenu.isOpen = false"
      :type="'folder'"
      :position="contextMenu.position"
      :target-el="folderStore.folderRef"
    />
  </div>
</template>
