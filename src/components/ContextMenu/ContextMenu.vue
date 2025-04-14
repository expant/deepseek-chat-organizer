<script setup>
import { useFolders } from "@/composables/useFolders";
import { useChats } from "@/composables/useChats";
import { useContextMenuHandlers } from "./useContextMenuHandlers";
import ContextMenuButton from "../buttons/ContextMenuButton.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
  targetEl: {
    type: HTMLElement,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const chatStore = useChats();
const folderStore = useFolders();
const { handleAddChats, closeMenuAndRemoveFromFolder } = useContextMenuHandlers(
  props,
  emit
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="type === 'folder'"
      class="context-menu cm-folder"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <ContextMenuButton name="Add chat(s)" @click="handleAddChats" />
      <ContextMenuButton
        name="New folder"
        @click="folderStore.onCreate('context-menu')"
      />
      <div class="line"></div>
      <ContextMenuButton name="Rename" @click="folderStore.prepareForRename" />
      <ContextMenuButton name="Delete" @click="folderStore.onDelete" />
    </div>
    <div
      v-else
      class="context-menu cm-chat"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      <ContextMenuButton name="Rename" @click="chatStore.prepareForRename" />
      <ContextMenuButton
        name="Delete from folder"
        @click="closeMenuAndRemoveFromFolder"
      />
      <ContextMenuButton name="Delete" @click="chatStore.onDelete" />
    </div>
  </transition>
</template>
