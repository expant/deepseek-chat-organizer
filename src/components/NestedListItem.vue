<script setup>
import NestedList from "./NestedList.vue";
import FolderItem from "./FolderItem.vue";
import ChatItem from "./ChatItem.vue";
import { ref, watch } from "vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const isFolderOpen = ref(props.node?.isOpen);
</script>

<template>
  <li class="folders__item">
    <ChatItem v-if="node.type === 'chat'" :chat="node" />
    <template v-else>
      <FolderItem
        :name="node.name"
        :id="node.id"
        v-model:is-folder-open="isFolderOpen"
      />
      <nested-list v-show="isFolderOpen" :items="node.children" />
    </template>
  </li>
</template>
