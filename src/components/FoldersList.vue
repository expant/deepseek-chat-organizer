<script setup>
import { onMounted } from 'vue';


// const addNewFolder = () => {
  
// };

onMounted(() => {
  chrome.storage.local.set({ 'frontend': { type: 'folder' } }, () => {
    message.value = "Данные сохранены";
  });
  chrome.storage.local.set({ 'backend': { type: 'folder' } }, () => {
    message.value = "Данные сохранены";
  });

  console.log(chrome.storage.local.get(null, (items) => {
    const keys = Object.keys(items).forEach((key) => {
      chrome.storage.local.get([key], (result) => console.log(result));
    });
    console.log(keys);
  }));
})


</script>

<template>
  <div class="folders">
    <button @click="addNewFolder" class="new-folder">New folder</button>
    <ul class="folders__list">
      
    </ul>
  </div>
</template>