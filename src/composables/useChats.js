import { nextTick } from "vue";
import { classNames } from "@/variables";
import { useStorage } from "./useStorage";
import { renameDSChat } from "@/content_scripts/dom/handlers";
import { handleChatDeletion } from "@/content_scripts/dom/handlers";
import { deleteChat, renameChat } from "@/utils/chatAndFolderLogic";
import { setObservationType, setNames } from "@/content_scripts/dom/state";
import {
  simulateContextMenuAction,
  getDSChatEl,
  getChatOrFolderInput,
} from "@/utils/helpers";

const deleteFolderId = (id, chats) =>
  chats.map((item) => (item.id === id ? { ...item, folderId: null } : item));

const deleteChatFromList = (id, chats) =>
  chats.filter((item) => item.id !== id);

export function useChats(contextMenu, isEditing) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const onDelete = async () => {
    const id = contextMenu.value.chatId;
    setObservationType("deleteFromFolder");
    await handleChatDeletion(id);
  };

  const onDeleteFromFolder = async (target) => {
    const id = contextMenu.value.chatId;
    contextMenu.value = { ...contextMenu.value, isOpen: false };

    const newFolders = deleteChat(folders.value, id);
    const newChats =
      target === "from folder"
        ? deleteFolderId(id, chats.value)
        : deleteChatFromList(id, chats.value);

    await setChats(newChats);
    await setFolders(newFolders);
  };

  const onRename = async (oldName, newName, id) => {
    if (!newName) return;

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
      simulateContextMenuAction(classNames.RENAME_BTN);
      renameDSChat();
    }, 100);
    isEditing.value = false;
  };

  const prepareForRename = async () => {
    const id = contextMenu.value.chatId;

    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };

    await nextTick();
    console.log(getChatOrFolderInput("chat", id), id);

    getChatOrFolderInput("chat", id).focus();
  };

  return {
    chats,
    setChats,
    onDelete,
    onRename,
    prepareForRename,
    onDeleteFromFolder,
  };
}
