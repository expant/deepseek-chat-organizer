<script setup>
import NestedListItem from "./NestedListItem.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

console.log("NestedList items:", props.items);
</script>

<template>
  <transition name="fade-list">
    <ul class="folders__list">
      <NestedListItem v-for="node in items" :key="node.id" :node="node" />
    </ul>
  </transition>
</template>
