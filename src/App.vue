<script setup>
import { ref, onMounted, provide, reactive } from "vue";
import NestedList from "./components/NestedList.vue";
import ContextMenu from "./components/ContextMenu.vue";

const folders = [
  {
    id: 234234,
    type: "folder",
    name: "Untitled",
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

const getBaseNames = (items, acc) =>
  items.reduce((names, item) => {
    if (typeof item === "string") {
      return names;
    }

    const [text] = item.name.split(" ");
    if (text === "Untitled") {
      const newNames = [...names, item.name];
      return item.children ? getBaseNames(item.children, newNames) : newNames;
    }

    return getBaseNames(item.children, names);
  }, acc);

onMounted(async () => {
  await chrome.storage.local.set({ folders });
  const items = await chrome.storage.local.get(["folders"]);
  folderList.value = items.folders;
  baseFolderNames.value = getBaseNames(folderList.value, []);
  baseFolderNames.value = baseFolderNames.value.sort((a, b) => {
    if ()
    console.log(a, b);
  });
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
