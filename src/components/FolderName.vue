<script setup>
import { ref, computed, inject } from "vue";
import IconArrow from "./icons/IconArrow.vue";
import IconDots from "./icons/IconDots.vue";
import ContextMenu from "./ContextMenu.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isFolderOpen"]);
const showDots = ref(false);

// Внедряем предоставленные значения
const setOpenContextMenuId = inject("setOpenContextMenuId");
const setContextMenuPosition = inject("setContextMenuPosition");
const openContextMenuId = inject("openContextMenuId");

const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);

const rotationStyles = computed(() => ({
  transform: props.isFolderOpen ? "rotate(90deg)" : "rotate(0deg)",
}));

const openContextMenu = (event) => {
  // Сообщаем родительскому компоненту, что это меню открыто
  setOpenContextMenuId(props.id);

  // Получаем координаты кнопки
  const buttonRect = event.target.getBoundingClientRect();
  const position = {
    top: buttonRect.bottom + window.scrollY,
    left: buttonRect.left + window.scrollX,
  };
  setContextMenuPosition(position);
};

const isContextMenuOpen = computed(() => openContextMenuId.value === props.id);
</script>

<template>
  <div
    class="folder-name"
    @click="toggleFolder"
    @mouseover="showDots = true"
    @mouseleave="showDots = false"
  >
    <IconArrow class="icon-arrow" :style="rotationStyles" />
    <span class="folder-name__text">{{ props.name }}</span>

    <div
      class="icon-dots"
      v-show="showDots || isContextMenuOpen"
      @click.stop="openContextMenu"
    >
      <IconDots />
    </div>
    <!-- <ContextMenu v-show="showContextMenu" /> -->
  </div>
</template>
