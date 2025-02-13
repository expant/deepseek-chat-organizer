<script setup>
import { ref, onMounted, provide, onBeforeUpdate } from "vue";
import { getBaseNames, sortBaseNames } from "./utils/helpers.js";
import NestedList from "./components/NestedList.vue";
import ContextMenu from "./components/ContextMenu.vue";

const folders = [
  {
    id: 234234,
    type: "folder",
    name: "Untitled 4",
    isOpen: true,
    children: [
      { id: 4829, name: "Chat1", type: "chat"},
      { id: 4824, name: "Chat2", type: "chat"},
      { id: 4821, name: "Chat3", type: "chat"},
    ],
  },
  {
    id: 724556245,
    type: "folder",
    name: "Untitled 2",
    isOpen: true,
    children: [
      {
        id: 134513,
        type: "folder",
        name: "Node.js",
        isOpen: false,
        children: [],
        // children: [
        //   "Асинхронность",
        //   "Express и прочее прочее",
        //   {
        //     id: 8546452,
        //     type: "folder",
        //     name: "Untitled 3",
        //     isOpen: false,
        //     children: [
        //       "Роутинг",
        //       "Маршрутизация",
        //       "Примеры",
        //       "Очень длинное название чата",
        //     ],
        //   },
        //   {
        //     id: 85421452,
        //     type: "folder",
        //     name: "sdfsdfsd",
        //     isOpen: false,
        //     children: [
        //       "Роутинг",
        //       "Маршрутизация",
        //       "Примеры",
        //       "Очень длинное название чата",
        //     ],
        //   },
        // ],
      },
      { id: 48203, name: "Chat1", type: "chat"},
      { id: 17593, name: "Chat2", type: "chat"},
      { id: 86372, name: "Chat3", type: "chat"},
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
});

onBeforeUpdate(() => {
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
