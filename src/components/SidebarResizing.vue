<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { setNewWidth } from "@/utils/sidebarWidthResizing";
import { isOutsideClick } from "@/utils/helpers";
import { classNames } from "@/variables";
import IconWidth from "./icons/IconWidth.vue";
import BaseNotification from "./BaseNotification.vue";

const showMenu = ref(false);
const notificationRef = ref(null);
const menuPosition = ref({ left: "0px", top: "0px" });
const notiPosition = ref({ left: "0px", top: "0px" });
const scales = ref([
  { num: 1, isActive: true },
  { num: 1.25, isActive: false },
  { num: 1.5, isActive: false },
  { num: 1.75, isActive: false },
  { num: 2, isActive: false },
]);

const scrollContainer = document.querySelector(`.${classNames.CHAT_LIST}`);

const getElementWidth = (element) => {
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  const width = element.offsetWidth;
  element.style.display = 'none';
  return width;
}

const setPositions = async () => {
  const container = document.querySelector(".sidebar-resizing");
  const notification = container.querySelector(".notification");
  const menu = container.querySelector(".sidebar-resizing__menu");
  const resizingEl = document.querySelector(".sidebar-resizing__icon");
  const { sidebarResizing } = await chrome.storage.sync.get([
    "sidebarResizing",
  ]);
  const notiWidth = getElementWidth(notification);
  const menuWidth = getElementWidth(menu);

  const elementRect = container.getBoundingClientRect();
  const parentRect = scrollContainer.getBoundingClientRect();
  const marginRight = (parentRect.right - scrollContainer.scrollLeft) - elementRect.right;

  const rect = resizingEl.getBoundingClientRect();
  const sidebarWidthInt = parseInt(sidebarResizing.width, 10);
  const menuPositionLeft = sidebarWidthInt - menuWidth - marginRight - (rect.width / 2);
  const notiPositionLeft = sidebarWidthInt - marginRight - (rect.width / 2) - (notiWidth / 2);

  menuPosition.value = {
    left: `${menuPositionLeft}px`,
    top: `${rect.top + 30}px`,
  };
  notiPosition.value = {
    left: `${notiPositionLeft}px`,
    top: `${rect.top - 50}px`,
  };
};

const setActiveScale = async () => {
  const { sidebarResizing } = await chrome.storage.sync.get([
    "sidebarResizing",
  ]);

  scales.value = scales.value.map((item) => {
    if (item.num === sidebarResizing.scale) return { ...item, isActive: true };
    return { ...item, isActive: false };
  });
};

const onResizing = async (scale) => {
  showMenu.value = false;
  await setNewWidth(scale);
  await setPositions();
  await setActiveScale();
};

onMounted(() => {
  setTimeout(async () => {
    await setPositions();
    await setActiveScale();
  }, 500);

  document.addEventListener("click", (event) => {
    if (isOutsideClick(event, ".sidebar-resizing__menu")) return;
    showMenu.value = false;
  });

  scrollContainer.addEventListener("scroll", setPositions);
});

onUnmounted(() => {
  document.removeEventListener("click", isOutsideClick);
  scrollContainer.removeEventListener("scroll", setPositions);
});
</script>
<template>
  <div class="sidebar-resizing">
    <div class="sidebar-resizing__icon-wrap">
      <div
        class="sidebar-resizing__icon"
        @click.stop="showMenu = !showMenu"
        @mouseenter="notificationRef?.onShow('enter')"
        @mouseleave="notificationRef?.onShow()"
      >
        <IconWidth />
      </div>
    </div>

    <transition name="fade">
      <div
        class="sidebar-resizing__menu"
        :style="`left: ${menuPosition.left}; top: ${menuPosition.top}`"
        v-show="showMenu"
      >
        <button
          v-for="scale in scales"
          :key="scale.num"
          :class="scale.isActive ? 'active-scale' : ''"
          @click="onResizing(scale.num)"
        >
          {{ scale.num + "x" }}
        </button>
      </div>
    </transition>

    <base-notification ref="notificationRef" :position="notiPosition">
      Change sidebar width
    </base-notification>
  </div>
</template>
