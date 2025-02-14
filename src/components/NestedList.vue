<script setup>
import { computed } from "vue";
import NestedListItem from "./NestedListItem.vue";
import draggable from "vuedraggable";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const onDragStart = (event) => {
  setTimeout(() => {
    const dropFilesEl = document.querySelector(".f0046890");
    console.log(dropFilesEl);
    if (dropFilesEl) {
      dropFilesEl.style.display = "none";
    }
  }, 100);
};
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
