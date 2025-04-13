import { nextTick, computed } from "vue";
import { classNames } from "@/constants";
import { useStorage } from "./useStorage";
import { renameDSChat } from "@/content_scripts/dom/handlers";
import { handleChatDeletion } from "@/content_scripts/dom/handlers";
import { setObservationType, setNames } from "@/content_scripts/dom/state";
import { deleteChat, renameChat, deleteFolderIdFromChats } from "@/utils/chatAndFolderLogic";
import {
  simulateContextMenuAction,
  getDSChatEl,
  getChatOrFolderInput,
} from "@/utils/helpers";

export function useChats(contextMenu, isEditing) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const onDelete = async () => {
    const id = contextMenu.value.chatId;
    setObservationType("deleteFromFolder");
    await handleChatDeletion(id);
  };

  const onDeleteFromFolder = async (id) => {
    const newFolders = deleteChat(folders.value, id);
    const newChats = deleteFolderIdFromChats(id, chats.value);

    await setChats(newChats);
    await setFolders(newFolders);
  };

  const onRename = async (oldName, newName, id) => {
    if (!newName) return;

    const { UI } = classNames;
    const chatName = chats.value.some((item) => item.name === newName);

    if (chatName) {
      isEditing.value = false;
      return;
    }

    setObservationType("renameFromFolder");

    const newChats = chats.value.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    const newFolders = renameChat(folders.value, id, newName);

    await setChats(newChats);
    await setFolders(newFolders);
    setNames(oldName, newName);

    const el = getDSChatEl(oldName);
    const dotsEl = el.nextElementSibling;
    dotsEl.click();

    setTimeout(() => {
      simulateContextMenuAction(UI.RENAME_BTN);
      renameDSChat();
    }, 100);
    isEditing.value = false;
  };

  const prepareForRename = async () => {
    const id = contextMenu.value.chatId;

    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };

    await nextTick();

    getChatOrFolderInput("chat", id).focus();
  };

  const isChatInFolder = computed(() => (id) => {
    const chat = chats.value.find((item) => item.id === id);
    return !!chat?.folderId;
  });

  return {
    chats,
    setChats,
    onDelete,
    onRename,
    prepareForRename,
    onDeleteFromFolder,
    isChatInFolder
  };
}
