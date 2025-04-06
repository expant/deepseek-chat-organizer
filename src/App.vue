<script setup>
import _ from "lodash";
import { ref, onMounted, onUnmounted, provide, nextTick } from "vue";
import { emitter } from "@/content_scripts/dom/state.js";
import { setCurrentWidth } from "./utils/sidebarWidthResizing";
import { getChatsFromDomElements } from "@/storage.js";
import { sortBaseNames, getBaseFolderNames } from "./utils/baseFolderNames.js";
import {
  createFolder,
  filterFoldersByExistingChats,
} from "@/utils/chatAndFolderLogic.js";

import { useTheme } from "./composables/useTheme.js";
import { useStorage } from "./composables/useStorage.js";

import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import SidebarResizing from "./components/SidebarResizing.vue";
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
const { data: folders, update: setFolders } = useStorage("folders", []);
const { data: chats, update: setChats } = useStorage("chats", []);

const onCreateFolder = async () => {
  const newFolderArgs = [_.cloneDeep(folders.value), 0, baseFolderNames.value];
  const [newFolders, newFolderId] = createFolder(...newFolderArgs);

  setFolders(newFolders);

  const baseNames = getBaseFolderNames(folders.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);

  contextMenu.value = {
    ...contextMenu.value,
    isOpen: false,
    folderId: newFolderId,
  };
  isEditingFolderName.value = true;

  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

onMounted(async () => {
  setTimeout(async () => {
    const newChats = await getChatsFromDomElements(chats.value);
    const newFolders = filterFoldersByExistingChats(folders.value, chats.value);

    await setChats(newChats);
    await setFolders(newFolders);

    if (folders.value) {
      console.log(folders.value);
      const baseNames = getBaseFolderNames(folders.value, []);
      baseFolderNames.value = baseNames.sort(sortBaseNames);
    }

    await setCurrentWidth();

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
      <NestedList :items="folders" />
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
