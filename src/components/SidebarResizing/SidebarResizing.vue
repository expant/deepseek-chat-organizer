<script setup>
import { ref } from "vue";
import { useSidebarResizing } from "./useSidebarResizing.js"
import IconWidth from "../icons/IconWidth.vue";
import BaseNotification from "../BaseNotification.vue";

const notificationRef = ref(null);

const {
  scales,
  showMenu,
  menuPosition,
  notiPosition,
  onResizing,
} = useSidebarResizing();
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
