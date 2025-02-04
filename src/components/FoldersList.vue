<script setup>
import { ref, onMounted, watch } from "vue";
import NestedList from "./NestedList.vue";
import FolderName from "./FolderName.vue";

const folders = [
  {
    type: "folder",
    name: "frontend",
    isOpen: false,
    children: ["Chat1", "Chat2", "Chat3"],
  },
  {
    type: "folder",
    name: "backend",
    isOpen: false,
    children: ["Chat1", "Chat2", "Chat3"],
  },
];

const isFolderOpen = ref(false);
const folderList = ref([]);

const clearFolders = () =>
  chrome.storage.local.clear(() => {
    folderList.value = [];
  });

onMounted(() => {
  chrome.storage.local.set({ folders }, () => {
    chrome.storage.local.get(null, (items) => {
      Object.keys(items).forEach((key) => {
        chrome.storage.local.get([key], (result) => {
          folderList.value.push(result);
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
    <ul class="folders__list">
      <template v-if="folderList.length > 0 && folderList[0].folders">
        <li
          class="folders__item"
          v-for="(node, i) in folderList[0].folders"
          :key="i"
        >
          <FolderName :name="node.name" v-model:is-folder-open="isFolderOpen" />
          <span v-if="typeof node === 'string'">{{ node }}</span>
          <nested-list v-else v-model:is-folder-open="isFolderOpen" :items="node.children" />
        </li>
      </template>
      <template v-else>
        <li>Нет данных</li>
      </template>
    </ul>
  </div>
</template>
