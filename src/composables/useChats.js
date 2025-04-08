import { nextTick } from "vue";
import { useStorage } from "./useStorage";
import { deleteChat } from "@/utils/chatAndFolderLogic";
import { setObservationType } from "@/content_scripts/dom/state";
import { handleChatDeletion } from "@/content_scripts/dom/handlers";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames";

const inputClassname = "chat-name__input";

const deleteFolderId = (id, chats) =>
  chats.map((item) => (item.id === id ? { ...item, folderId: null } : item));

const deleteChatFromList = (id, chats) =>
  chats.filter((item) => item.id !== id);

export function useChats(baseNames, contextMenu, isEditing) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const onRename = async () => {
    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    await nextTick();
    document.querySelector(`.${inputClassname}`).focus();
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

  const onDelete = async () => {
    const id = contextMenu.value.chatId;
    setObservationType("deleteFromFolder");
    await handleChatDeletion(id);
  };

  return {
    chats,
    setChats,
    onDelete,
    onRename,
    onDeleteFromFolder,
  };
}
