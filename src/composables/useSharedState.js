import { ref, provide } from "vue";

export function useSharedState() {
  const baseFolderNames = ref([]);
  const showSearchChats = ref(false);
  const isEditingChatName = ref(false);
  const isEditingFolderName = ref(false);

  const chatMenu = ref({
    isOpen: false,
    position: { top: 0, left: 0 },
    id: null,
  });

  const folderMenu = ref({
    isOpen: false,
    position: { top: 0, left: 0 },
    id: null,
  });

  provide("chatMenu", chatMenu);
  provide("folderMenu", folderMenu);
  provide("baseFolderNames", baseFolderNames);
  provide("showSearchChats", showSearchChats);
  provide("isEditingChatName", isEditingChatName);
  provide("isEditingFolderName", isEditingFolderName);

  return {
    baseFolderNames,
    showSearchChats,
    isEditingChatName,
    isEditingFolderName,
    chatMenu,
    folderMenu,
  }
}