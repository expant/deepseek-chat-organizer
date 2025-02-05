<script setup>
import { ref, computed } from "vue";
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

const showDots = ref(false);
const showContextMenu = ref(false);
const emit = defineEmits(["update:isFolderOpen"]);
const toggleFolder = () => emit("update:isFolderOpen", !props.isFolderOpen);

const rotationStyles = computed(() => ({
  transform: props.isFolderOpen ? "rotate(90deg)" : "rotate(0deg)",
}));
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
      v-show="showDots || showContextMenu"
      @click.stop="showContextMenu = !showContextMenu"
    >
      <IconDots />
    </div>
    <!-- <ContextMenu v-show="showContextMenu" /> -->
  </div>
</template>
