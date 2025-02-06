<script setup>
import IconRename from "../icons/IconRename.vue";
import IconDelete from "../icons/IconDelete.vue";

const props = defineProps({
  name: String,
  required: true,
});
</script>

<template>
  <button class="context-menu__btn">
    <template v-if="name === 'Rename'">
      <IconRename />
      <span class="btn-name rename">{{ name }}</span>
    </template>
    <template v-else-if="name === 'Delete'">
      <IconDelete />
      <span class="btn-name delete">{{ name }}</span>
    </template>
  </button>
</template>
