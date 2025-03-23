<script setup>
import _ from "lodash";
import { ref, onMounted, provide, nextTick } from "vue";
import { sortBaseNames, getBaseFolderNames } from "./utils/baseFolderNames.js";
import { convertObjToArrDeep } from "./utils/helpers.js";
import { createFolder } from "@/utils/chatAndFolderLogic.js";
import { initData } from "./storage.js";
import ContextMenu from "./components/ContextMenu.vue";
import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import IconFolder from "./components/icons/IconFolder.vue";

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
  if (!folders) return;
  folderList.value = folders;
  const baseNames = getBaseFolderNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);

  // const chatElements = document.querySelectorAll(".f9edaa3c");
  // const entries = Object.entries(chatE   lements);
  // const targetChatEl = entries.find(([_, el]) => {
  //   const textEl = el.querySelector(".c08e6e93");
  //   return textEl.textContent === "Правильный прием витамина D" ? true : false;
  // });
  // console.log(targetChatEl);
  // const dots = targetChatEl[1].querySelector(".aa7b7ebb");
  // setTimeout(() => dots.click(), 1000);
});
</script>

<template>
  <div class="folders">
    <div class="first-nested-list">
      <NestedList :items="folderList" />
      <button class="new-folder-app" @click="onCreateFolder">
        <IconFolder />
        <span>New folder</span>
      </button>
    </div>
    <ContextMenu
      v-show="contextMenu.isOpen"
      @close="contextMenu.isOpen = false"
      :type="'folder'"
      :position="contextMenu.position"
    />
    <ContextMenu
      v-show="contextMenuChat.isOpen"
      @close="contextMenuChat.isOpen = false"
      :type="'chat'"
      :position="contextMenuChat.position"
    />
    <SearchChats
      v-if="showSearchChats"
      @close="showSearchChats = false"
      :isOpen="showSearchChats"
    />
  </div>
</template>
