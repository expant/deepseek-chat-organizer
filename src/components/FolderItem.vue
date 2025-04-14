<script setup>
import { ref, inject } from "vue";
import { useFolders } from "@/composables/useFolders";
import { useContextMenuState } from "@/composables/useContextMenuState";
import ContextMenu from "./ContextMenu/ContextMenu.vue";
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

const folderMenu = inject("folderMenu");
const isEditingFolderName = inject("isEditingFolderName");

const showDots = ref(false);
const inputRef = ref(null);
const folderRef = ref(null);

const folderStore = useFolders();
const { open } = useContextMenuState();

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);
</script>
<template>
  <div class="folder-wrapper">
    <input
      v-show="isEditingFolderName && id === folderMenu.id"
      ref="inputRef"
      class="folder-name__input"
      type="text"
      name="folder-name"
      :value="name"
      :data-id="id"
      @blur="folderStore.onRename(inputRef.value.trim(), id)"
      @keydown.enter="folderStore.onRename(inputRef.value.trim(), id)"
    />
    <div
      v-show="!isEditingFolderName || id !== folderMenu.id"
      ref="folderRef"
      class="folder-name"
      :data-id="id"
      @click="toggleFolder"
      @mouseover="showDots = true"
      @mouseleave="showDots = false"
    >
      <IconArrow :isFolderOpen="isFolderOpen" />
      <span class="folder-name__text">{{ name }}</span>
      <div class="icon-dots" v-show="showDots" @click.stop="open('folder', id)">
        <IconDots />
      </div>
    </div>
    <ContextMenu
      v-show="folderMenu.isOpen"
      @close="folderMenu.isOpen = false"
      :type="'folder'"
      :position="folderMenu.position"
      :target-el="folderRef"
    />
  </div>
</template>
