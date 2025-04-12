<script setup>
import _ from "lodash";
import { ref, onMounted, onUnmounted, provide } from "vue";
import { emitter } from "@/content_scripts/dom/state.js";
import { setCurrentWidth } from "./utils/sidebarWidthResizing";
import { getChatsFromDomElements } from "@/storage.js";
import { sortBaseNames, getBaseFolderNames } from "./utils/baseFolderNames.js";
import { filterFoldersByExistingChats } from "@/utils/chatAndFolderLogic.js";
import { useTheme } from "./composables/useTheme.js";
import { useChats } from "./composables/useChats";
import { useFolders } from "./composables/useFolders.js";

import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import SidebarResizing from "./components/SidebarResizing/SidebarResizing.vue";
import IconFolder from "./components/icons/IconFolder.vue";

const baseFolderNames = ref([]);
const showSearchChats = ref(false);
const isEditingChatName = ref(false);
const isEditingFolderName = ref(false);
const contextMenu = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  folderId: null,
});
const contextMenuChat = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  chatId: null,
});

provide("contextMenu", contextMenu);
provide("contextMenuChat", contextMenuChat);
provide("baseFolderNames", baseFolderNames);
provide("showSearchChats", showSearchChats);
provide("isEditingChatName", isEditingChatName);
provide("isEditingFolderName", isEditingFolderName);

const { theme } = useTheme();
const { chats, setChats } = useChats();
const { folders, setFolders, onCreate } = useFolders(
  baseFolderNames,
  contextMenu,
  isEditingFolderName
);

onMounted(() => {
  setTimeout(() => {
    const newChats = getChatsFromDomElements(chats.value);
    const newFolders = filterFoldersByExistingChats(folders.value, newChats);

    setChats(newChats);
    setFolders(newFolders);

    if (newFolders) {
      const baseNames = getBaseFolderNames(newFolders, []);
      baseFolderNames.value = baseNames.sort(sortBaseNames);
    }

    setCurrentWidth();

    emitter.on("updateFolders", (newValue) => {
      setFolders(newValue);
    });
    emitter.on("updateChats", (newValue) => {
      setChats(newValue);
    });
  }, 200);
});

onUnmounted(() => {
  emitter.off("updateFolders");
  emitter.off("updateChats");
});
</script>

<template>
  <div :class="`folders ${theme}`">
    <SidebarResizing />
    <div class="first-nested-list">
      <button class="new-folder-app" @click="onCreate('app')">
        <IconFolder />
        <span>New folder</span>
      </button>
      <NestedList :items="folders" />
    </div>
    <SearchChats
      v-if="showSearchChats"
      @close="showSearchChats = false"
      :isOpen="showSearchChats"
    />
  </div>
</template>
