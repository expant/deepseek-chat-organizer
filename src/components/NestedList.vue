<script setup>
import { ref } from "vue";
import FolderName from "./FolderName.vue";

// const nestedUlStyles = { display: 'none' };
const isFolderOpen = ref(false);

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const f = () => {
  isFolderOpen.value = !isFolderOpen.value;
  console.log("NestedList.vue, isFolderOpen: ", isFolderOpen.value);
};
</script>

<template>
  <ul class="folders__list nested" v-show="isFolderOpen">
    <li class="folders__item" v-for="(item, i) in items" :key="i">
      <span v-if="typeof item === 'string'">{{ item }}</span>
      <template v-else>
        <!-- FIXME: не работает исправно toggle-foler -->
        <FolderName @toggle-folder="f" :name="item.name" />
        <NestedList :items="item.children" />
      </template>
    </li>
  </ul>
</template>
