<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { setNewWidth } from "@/utils/sidebarWidthResizing";
import IconWidth from "./icons/IconWidth.vue";
import BaseNotification from "./BaseNotification.vue";

const showResizionMenu = ref(false);
const showNotification = ref(false);

const onOutsideClick = (event, type) => {
  const resizingMenu = document.querySelector('.sidebar-resizing__menu');

  if (resizingMenu && !resizingMenu.contains(event.target)) {
    showResizionMenu.value = false;
  }
};

const onResizing = (scale) => {
  showResizionMenu.value = false;
  setNewWidth(scale);
};

onMounted(() => document.addEventListener("click", onOutsideClick));
onUnmounted(() => document.removeEventListener("click", onOutsideClick));
</script>
<template>
  <div class="sidebar-resizing">
    <div class="sidebar-resizing__icon-wrap">

      <!-- TODO: Перенести noti в App -->
      <base-notification v-show="showNotification">
        Change sidebar width
      </base-notification>
      <div 
        class="sidebar-resizing__icon" 
        @click.stop="showResizionMenu = !showResizionMenu"
        @mouseenter="showNotification = true"
        @mouseleave="showNotification = false"
      >
        <IconWidth />
      </div>
    </div>
    <div class="sidebar-resizing__menu" v-show="showResizionMenu">
      <button @click="onResizing(1)">1 w</button>
      <button @click="onResizing(1.25)">1.25 w</button>
      <button @click="onResizing(1.50)">1.50 w</button>
      <button @click="onResizing(1.75)">1.75 w</button>
      <button @click="onResizing(2)">2 w</button>
    </div>
  </div>  
</template>