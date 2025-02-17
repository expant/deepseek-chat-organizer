<script setup>
import _ from "lodash";
import { ref, onMounted, provide, nextTick } from "vue";
import {
  getBaseNames,
  sortBaseNames,
  convertObjToArrDeep,
} from "./utils/helpers.js";
import { createFolder } from "@/background.js";
import ContextMenu from "./components/ContextMenu.vue";
import SearchChats from "./components/SearchChats.vue";
import NestedList from "./components/NestedList.vue";
import IconFolder from "./components/icons/IconFolder.vue";

const folderList = ref([]);
const baseFolderNames = ref([]);
const showSearchChats = ref(false);
const isEditingFolderName = ref(false);
const contextMenu = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  folderId: null,
});

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
  const baseNames = getBaseNames(folderList.value, []);
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
  const items = await chrome.storage.local.get(["folders"]);
  if (!items.folders) return;

  folderList.value = convertObjToArrDeep(items.folders);
  console.log(folderList.value);
  const baseNames = getBaseNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);
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
