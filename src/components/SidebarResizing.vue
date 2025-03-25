<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { setNewWidth } from "@/utils/sidebarWidthResizing";
import { classNames } from "@/variables";
import IconWidth from "./icons/IconWidth.vue";
import BaseNotification from "./BaseNotification.vue";

const showResizionMenu = ref(false);
const showNotification = ref(false);
const menuPosition = ref({ left: "0px", top: "0px" });
const notiPosition = ref({ left: "0px", top: "0px" });
const menuWidth = 235;
const scrollContainer = document.querySelector(`.${classNames.CHAT_LIST}`);

const onOutsideClick = (event, type) => {
  const resizingMenu = document.querySelector(".sidebar-resizing__menu");

  if (resizingMenu && !resizingMenu.contains(event.target)) {
    showResizionMenu.value = false;
  }
};

const setMenuPosition = async () => {
  const resizingEl = document.querySelector(".sidebar-resizing__icon");
  const rect = resizingEl.getBoundingClientRect();
  const { sidebarWidth } = await chrome.storage.sync.get(["sidebarWidth"]);
  const left = `${parseInt(sidebarWidth, 10) - menuWidth - 20}px`;
  const top = `${rect.top + 30}px`;
  menuPosition.value = { left, top };
};

const setNotiPosition = async () => {
  const resizingEl = document.querySelector(".sidebar-resizing__icon");
  const rect = resizingEl.getBoundingClientRect();
  const { sidebarWidth } = await chrome.storage.sync.get(["sidebarWidth"]);
  const left = `${parseInt(sidebarWidth, 10) - 115}px`;
  const top = `${rect.top - 50}px`;
  notiPosition.value = { left, top };
};

const handlePositions = () => {
  setMenuPosition();
  setNotiPosition();
};

const onResizing = async (scale) => {
  showResizionMenu.value = false;
  await setNewWidth(scale);
  handlePositions();
};

onMounted(async () => {
  await setMenuPosition();
  await setNotiPosition();
  document.addEventListener("click", onOutsideClick);
  scrollContainer.addEventListener("scroll", handlePositions);
});
onUnmounted(() => {
  document.removeEventListener("click", onOutsideClick);
  scrollContainer.removeEventListener("scroll", handlePositions);
});
</script>
<template>
  <div class="sidebar-resizing">
    <div class="sidebar-resizing__icon-wrap">
      <!-- <base-notification v-show="showNotification" :position="notiPosition">
        Change sidebar width
      </base-notification> -->

      <div
        class="sidebar-resizing__icon"
        @click.stop="showResizionMenu = !showResizionMenu"
        @mouseenter="showNotification = true"
        @mouseleave="showNotification = false"
      >
        <IconWidth />
      </div>
    </div>

    <transition name="fade">
      <div
        class="notification"
        v-show="showNotification"
        :style="`left: ${notiPosition.left}; top: ${notiPosition.top};`"
      >
        Change sidebar width
      </div>
    </transition>

    <transition name="fade">
      <div
        class="sidebar-resizing__menu"
        :style="`left: ${menuPosition.left}; top: ${menuPosition.top}`"
        v-show="showResizionMenu"
      >
        <button @click="onResizing(1)">1 w</button>
        <button @click="onResizing(1.25)">1.25 w</button>
        <button @click="onResizing(1.5)">1.50 w</button>
        <button @click="onResizing(1.75)">1.75 w</button>
        <button @click="onResizing(2)">2 w</button>
      </div>
    </transition>
  </div>
</template>
