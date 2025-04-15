<script setup>
import { useTheme } from "./composables/useTheme.js";
import { useFolders } from "./composables/useFolders.js";
import { useSharedState } from "@/composables/useSharedState";
import { useAppInitialization } from "./composables/useAppInitialization.js";

import NestedList from "./components/NestedList.vue";
import SearchChats from "./components/SearchChats/SearchChats.vue";
import IconFolder from "./components/icons/IconFolder.vue";
import SidebarResizing from "./components/SidebarResizing/SidebarResizing.vue";

const sharedState = useSharedState();
const { theme } = useTheme();
const { folders, onCreate } = useFolders(
  sharedState.folderMenu,
  sharedState.baseFolderNames,
  sharedState.isEditingFolderName
);

const { showSearchChats } = sharedState;

useAppInitialization(sharedState);
</script>

<template>
  <div :class="`folders ${theme}`">
    <SidebarResizing />
    <div class="first-nested-list">
      <button class="new-folder-app" @click="onCreate('app')">
        <IconFolder />
        <span>New folder</span>
      </button>
      <NestedList :items="folders" />
    </div>
    <SearchChats
      v-if="showSearchChats"
      @close="showSearchChats = false"
      :isOpen="showSearchChats"
    />
  </div>
</template>
