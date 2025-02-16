<script setup>
import NestedListItem from "./NestedListItem.vue";
import draggable from "vuedraggable";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <transition name="fade-list">
    <draggable
      class="folders__list"
      v-model="props.items"
      tag="ul"
      item-key="id"
      @start="onDragStart"
    >
      <template #item="{ element }">
        <NestedListItem :node="element" />
      </template>
    </draggable>
  </transition>
</template>
