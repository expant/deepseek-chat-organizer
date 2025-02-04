<script setup>
import { ref, watch } from "vue";
import FolderName from "./FolderName.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  isFolderOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isFolderOpen']);
</script>

<template>
  <ul class="folders__list nested" v-show="props.isFolderOpen">
    <li class="folders__item" v-for="(item, i) in props.items" :key="i">
      <span v-if="typeof item === 'string'">{{ item }}</span>
      <template v-else>
        <FolderName v-model:is-folder-open="props.isFolderOpen" :name="item.name" />
        <NestedList v-model:is-folder-open="props.isFolderOpen" :items="item.children" />
      </template>
    </li>
  </ul>
</template>
