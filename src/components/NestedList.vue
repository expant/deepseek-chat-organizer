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
  <transition name="fade-list">
    <ul class="folders__list">
      <NestedListItem v-for="(node, i) in items" :key="i" :node="node" />
    </ul>
  </transition>
</template>
