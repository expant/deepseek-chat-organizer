<script setup>
import IconChat from "../icons/IconChat.vue";
import IconRename from "../icons/IconRename.vue";
import IconDelete from "../icons/IconDelete.vue";
import IconFolder from "../icons/IconFolder.vue";
import IconDeleteFromFolder from "../icons/IconDeleteFromFolder.vue";

const props = defineProps({
  name: String,
  required: true,
});
</script>

<template>
  <button class="context-menu__btn">
    <template v-if="name === 'Add chat(s)'">
      <IconChat />
      <span class="btn-name add-chat">{{ name }}</span>
    </template>
    <template v-if="name === 'New folder'">
      <IconFolder />
      <span class="btn-name create">{{ name }}</span>
    </template>
    <template v-if="name === 'Rename'">
      <IconRename />
      <span class="btn-name rename">{{ name }}</span>
    </template>
    <template v-else-if="name === 'Delete'">
      <IconDelete />
      <span class="btn-name delete">{{ name }}</span>
    </template>
    <template v-else-if="name === 'Delete from folder'">
      <IconDeleteFromFolder />
      <span class="btn-name delete-from-folder">{{ name }}</span>
    </template>
  </button>
</template>
