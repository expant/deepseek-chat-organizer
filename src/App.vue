<script setup>
import _ from "lodash";
import { ref, onMounted, provide, nextTick } from "vue";
import { sortBaseNames, getBaseFolderNames } from "./utils/baseFolderNames.js";
import { convertObjToArrDeep } from "./utils/helpers.js";
import { initChatsInStorage, loadFolders } from "./storage.js";
import { createFolder } from "@/background/background.js";
import ContextMenu from "./components/ContextMenu.vue";
import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import IconFolder from "./components/icons/IconFolder.vue";

const chatList = ref([]);
const folderList = ref([]);
const baseFolderNames = ref([]);
const showSearchChats = ref(false);
const isEditingFolderName = ref(false);
const contextMenu = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  folderId: null,
});

provide("chatList", chatList);
provide("folderList", folderList);
provide("contextMenu", contextMenu);
provide("baseFolderNames", baseFolderNames);
provide("showSearchChats", showSearchChats);
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
  await chrome.storage.local.set({ folders });
  await nextTick();
  document.querySelector(".folder-name__input").focus();
};

onMounted(async () => {
  const { chats } = await chrome.storage.local.get(["chats"]);

  if (!chats) {
    await initChatsInStorage([]);
  } else {
    await initChatsInStorage(convertObjToArrDeep(chats, "chats"));
  }
  await loadFolders();

  const { folders } = await chrome.storage.local.get(["folders"]);
  const { chats: newChats } = await chrome.storage.local.get(["chats"]);

  chatList.value = newChats;
  if (!folders) return;
  folderList.value = folders;
  const baseNames = getBaseFolderNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);

  // const chatElements = document.querySelectorAll(".f9edaa3c");
  // const entries = Object.entries(chatElements);
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
      :position="contextMenu.position"
    />
    <SearchChats
      v-if="showSearchChats"
      @close="showSearchChats = false"
      :isOpen="showSearchChats"
    />
  </div>
</template>
