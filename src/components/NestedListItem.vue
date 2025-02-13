<script setup>
import NestedList from "./NestedList.vue";
import FolderName from "./FolderName.vue";
import { ref, watch } from "vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const isFolderOpen = ref(props.node?.isOpen);

console.log("NestedListItem node:", props.node);
</script>

<template>
  <li class="folders__item">
    <span class="chat" v-if="node.type === 'chat'">{{ node.name }}</span>
    <template v-else>
      <FolderName
        :name="node.name"
        :id="node.id"
        v-model:is-folder-open="isFolderOpen"
      />
      <nested-list v-show="isFolderOpen" :items="node.children" />
    </template>
  </li>
</template>
