<script setup>
import FolderName from "./FolderName.vue";
import NestedListItem from "./NestedListItem.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
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
</template>
