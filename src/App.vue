<script setup>
import { ref, onMounted, provide } from "vue";
import NestedList from "./components/NestedList.vue";
import FolderName from "./components/FolderName.vue";
import ContextMenu from "./ContextMenu.vue";

const folders = [
  {
    id: 1,
    type: "folder",
    name: "frontend html/css/js sdasdas",
    isOpen: false,
    children: ["Chat1", "Chat2", "Chat3"],
  },
  {
    id: 2,
    type: "folder",
    name: "backend",
    isOpen: false,
    children: [
      {
        id: 3,
        type: "folder",
        name: "Node.js",
        isOpen: false,
        children: [
          "Асинхронность",
          "Express и прочее прочее",
          {
            id: 4,
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

// const isFolderOpen = ref(false);
const folderList = ref([]);
const contextMenuPosition = ref({ top: 0, left: 0 });
const openContextMenuId = ref(null);
const setOpenContextMenuId = (id) => {
  openContextMenuId.value = id;
};
const setContextMenuPosition = (possition) => {
  contextMenuPosition.value = position;
}

provide("setOpenContextMenuId", setOpenContextMenuId);
provide("setContextMenuPosition", setContextMenuPosition);
provide("openContextMenuId", openContextMenuId);

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
      v-show="openContextMenuId" 
      @close="openContextMenuId = null" 
      :position="contextMenuPosition" 
    />
  </div>
</template>
