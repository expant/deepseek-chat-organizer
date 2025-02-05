<script setup>
import { ref, provide } from "vue";
import FolderName from "./FolderName.vue";
import NestedListItem from "./NestedListItem.vue";
import ContextMenu from "./ContextMenu.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const openContextMenuId = ref(null);
const setOpenContextMenuId = (id) => {
  openContextMenuId.value = id;
};

provide("setOpenContextMenuId", setOpenContextMenuId);
provide("openContextMenuId", openContextMenuId);
</script>

<template>
  <ul class="folders__list">
    <template v-if="props.items.length > 0 && props.items">
      <NestedListItem v-for="(node, i) in props.items" :key="i" :node="node" />
    </template>
    <template v-else>
      <li>Нет данных</li>
    </template>
  </ul>
  <ContextMenu />
</template>
