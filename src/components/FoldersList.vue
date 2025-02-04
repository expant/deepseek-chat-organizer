<script setup>
import { ref, onMounted, watch } from "vue";
import NestedList from "./NestedList.vue";
import FolderName from "./FolderName.vue";

const folders = [
  {
    type: "folder",
    name: "frontend",
    children: ["Chat1", "Chat2", "Chat3"],
  },
  {
    type: "folder",
    name: "backend",
    children: ["Chat1", "Chat2", "Chat3"],
  },
];

// const isEditing = ref(false);
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
          console.log(folderList.value);
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
      <li
        class="folders__item"
        v-for="(node, i) in folderList[0].folders"
        :key="i"
      >
        <FolderName :name="node.name" />
        <span v-if="typeof node === 'string'">{{ node }}</span>
        <nested-list v-else :items="node.children" />
      </li>
    </ul>
  </div>
</template>
