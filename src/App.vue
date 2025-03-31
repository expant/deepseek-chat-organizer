<script setup>
import _ from "lodash";
import { ref, onMounted, onUnmounted, provide, nextTick } from "vue";
import { initData } from "./storage.js";
import { emitter } from "@/content_scripts/dom/state.js";
import { createFolder } from "@/utils/chatAndFolderLogic.js";
import { setCurrentWidth } from "./utils/sidebarWidthResizing";
import { sortBaseNames, getBaseFolderNames } from "./utils/baseFolderNames.js";
import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import SidebarResizing from "./components/SidebarResizing.vue";
import IconFolder from "./components/icons/IconFolder.vue";

const theme = ref("light");
const chatList = ref([]);
const folderList = ref([]);
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

provide("theme", theme);
provide("chatList", chatList);
provide("folderList", folderList);
provide("contextMenu", contextMenu);
provide("contextMenuChat", contextMenuChat);
provide("baseFolderNames", baseFolderNames);
provide("showSearchChats", showSearchChats);
provide("isEditingChatName", isEditingChatName);
provide("isEditingFolderName", isEditingFolderName);

const onCreateFolder = async () => {
  const newFolderArgs = [
    _.cloneDeep(folderList.value),
    0,
    baseFolderNames.value,
  ];
  const [folders, newFolderId] = createFolder(...newFolderArgs);
  folderList.value = folders;
  const baseNames = getBaseFolderNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);
  contextMenu.value = {
    ...contextMenu.value,
    isOpen: false,
    folderId: newFolderId,
  };
  isEditingFolderName.value = true;
  await chrome.storage.sync.set({ folders });
  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

onMounted(async () => {
  const { folders, chats } = await initData();
  chatList.value = chats;
  if (folders) {
    folderList.value = folders;
    const baseNames = getBaseFolderNames(folderList.value, []);
    baseFolderNames.value = baseNames.sort(sortBaseNames);
  }
  await setCurrentWidth();

  if (document.body.classList.contains("dark")) {
    theme.value = "dark";
  }
  emitter.on("updateFolders", (newValue) => {
    folderList.value = newValue;
  });
  emitter.on("updateChats", (newValue) => {
    chatList.value = newValue;
  });
  emitter.on("updateTheme", (newValue) => {
    theme.value = newValue;
  });
});

onUnmounted(() => {
  emitter.off("updateFolders");
  emitter.off("updateChats");
  emitter.off("updateTheme");
});
</script>

<template>
  <div :class="`folders ${theme}`">
    <SidebarResizing />
    <div class="first-nested-list">
      <NestedList :items="folderList" />
      <button class="new-folder-app" @click="onCreateFolder">
        <IconFolder />
        <span>New folder</span>
      </button>
    </div>
    <SearchChats
      v-if="showSearchChats"
      @close="showSearchChats = false"
      :isOpen="showSearchChats"
    />
  </div>
</template>
