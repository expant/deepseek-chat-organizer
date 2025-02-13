<script setup>
import NestedList from "./NestedList.vue";
import FolderName from "./FolderName.vue";
import { ref, onBeforeUpdate } from "vue";

const props = defineProps({
  node: {
    type: [String, Object],
    required: true,
  },
});

const isFolderOpen = ref(props.node?.isOpen);

// onBeforeUpdate(() => {
//   console.log(isFolderOpen.value, props.node?.name);
// });
</script>

<template>
  <li class="folders__item">
    <span class="chat" v-if="typeof node === 'string'">{{ node }}</span>
    <template v-else>
      <FolderName
        :name="props.node.name"
        :id="props.node.id"
        v-model:is-folder-open="isFolderOpen"
      />
      <nested-list v-show="isFolderOpen" :items="props.node.children" />
    </template>
  </li>
</template>
