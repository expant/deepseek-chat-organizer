<script setup>
import { ref, onMounted, provide, reactive } from "vue";
import NestedList from "./components/NestedList.vue";
import FolderName from "./components/FolderName.vue";
import ContextMenu from "./components/ContextMenu.vue";

const folders = [
  {
    id: Date.now(),
    type: "folder",
    name: "frontend html/css/js sdasdas",
    isOpen: false,
    children: ["Chat1", "Chat2", "Chat3"],
  },
  {
    id: Date.now(),
    type: "folder",
    name: "backend",
    isOpen: false,
    children: [
      {
        id: Date.now(),
        type: "folder",
        name: "Node.js",
        isOpen: false,
        children: [
          "Асинхронность",
          "Express и прочее прочее",
          {
            id: Date.now(),
            type: "folder",
            name: "Routers",
            isOpen: false,
            children: [
              "Роутинг",
              "Маршрутизация",
              "Примеры",
              "Очень длинное название чата",
            ],
          },
        ],
      },
      "Chat2",
      "Chat3",
    ],
  },
];
const folderList = ref([]);
const isEditingFolderName = ref(false);
const contextMenu = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  folderId: null,
});

provide("folderList", folderList);
provide("contextMenu", contextMenu);
provide("isEditingFolderName", isEditingFolderName);

const clearFolders = () =>
  chrome.storage.local.clear(() => {
    folderList.value = [];
  });

onMounted(() => {
  chrome.storage.local.set({ folders }, () => {
    chrome.storage.local.get(null, (items) => {
      Object.keys(items).forEach((key) => {
        chrome.storage.local.get([key], (result) => {
          const { folders } = result;
          folderList.value.push(...folders);
        });
      });
    });
  });
});
</script>

<template>
  <div class="folders">
    <button @click="addNewFolder" class="new-folder">New folder</button>
    <button @click="clearFolders" class="clear-folders">Clear folders</button>
    <div class="first-nested-list">
      <NestedList :items="folderList" />
    </div>
    <ContextMenu
      v-show="contextMenu.isOpen"
      @close="contextMenu.isOpen = false"
      :position="contextMenu.position"
    />
  </div>
</template>
