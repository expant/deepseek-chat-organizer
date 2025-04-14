import { ref, provide, onMounted, onUnmounted } from "vue";
import { emitter } from "@/content_scripts/dom/state.js";
import { getChatsFromDomElements } from "@/storage.js";
import { setCurrentWidth } from "@/utils/sidebarWidthResizing";
import { filterFoldersByExistingChats } from "@/utils/chatAndFolderLogic.js";
import { sortBaseNames, getBaseFolderNames } from "@/utils/baseFolderNames.js";

import { useChats } from "@/composables/useChats";
import { useFolders } from "@/composables/useFolders.js";

export function useAppInitialization(sharedState) {
  const {
    chatMenu,
    folderMenu,
    baseFolderNames,
    isEditingChatName,
    isEditingFolderName,
  } = sharedState;

  const { chats, setChats } = useChats(chatMenu, isEditingChatName);
  const { folders, setFolders } = useFolders(
    folderMenu,
    baseFolderNames,
    isEditingFolderName
  );
  
  const initApp = () => setTimeout(() => {
    const newChats = getChatsFromDomElements(chats.value);
    const newFolders = filterFoldersByExistingChats(folders.value, newChats);

    setChats(newChats);
    setFolders(newFolders);

    if (newFolders) {
      const baseNames = getBaseFolderNames(newFolders, []);
      baseFolderNames.value = baseNames.sort(sortBaseNames);
    }

    setCurrentWidth();

    emitter.on("updateFolders", (newValue) => {
      setFolders(newValue);
    });
    emitter.on("updateChats", (newValue) => {
      setChats(newValue);
    });
  }, 200);

  const cleanup = () => {
    emitter.off("updateFolders");
    emitter.off("updateChats");
  };

  onMounted(initApp);
  onUnmounted(cleanup);

  return {
    chatMenu,
    folderMenu,
    baseFolderNames,
    isEditingChatName,
    isEditingFolderName,
  }
}