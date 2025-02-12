<script setup>
import { ref, onMounted, provide, reactive } from "vue";
import { getBaseNames, sortBaseNames } from "./utils/helpers.js";
import NestedList from "./components/NestedList.vue";
import ContextMenu from "./components/ContextMenu.vue";

const folders = [
  {
    id: 234234,
    type: "folder",
    name: "Untitled 4",
    isOpen: false,
    children: ["Chat1", "Chat2", "Chat3"],
  },
  {
    id: 724556245,
    type: "folder",
    name: "Untitled 2",
    isOpen: false,
    children: [
      {
        id: 134513,
        type: "folder",
        name: "Node.js",
        isOpen: false,
        children: [
          "Асинхронность",
          "Express и прочее прочее",
          {
            id: 8546452,
            type: "folder",
            name: "Untitled 3",
            isOpen: false,
            children: [
              "Роутинг",
              "Маршрутизация",
              "Примеры",
              "Очень длинное название чата",
            ],
          },
          {
            id: 85421452,
            type: "folder",
            name: "sdfsdfsd",
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
const baseFolderNames = ref([]);
const isEditingFolderName = ref(false);
const contextMenu = ref({
  isOpen: false,
  position: { top: 0, left: 0 },
  folderId: null,
});

provide("folderList", folderList);
provide("contextMenu", contextMenu);
provide("isEditingFolderName", isEditingFolderName);
provide("baseFolderNames", baseFolderNames);

onMounted(async () => {
  await chrome.storage.local.set({ folders });
  const items = await chrome.storage.local.get(["folders"]);
  folderList.value = items.folders;
  const baseNames = getBaseNames(folderList.value, []);
  baseFolderNames.value = baseNames.sort(sortBaseNames);
  console.log(folderList.value);
});
</script>

<template>
  <div class="folders">
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
