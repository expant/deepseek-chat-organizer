import { nextTick } from "vue";
import { useStorage } from "./useStorage";
import { isNameNotUnique, getChatOrFolderInput } from "@/utils/helpers.js";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames";
import {
  createFolder,
  deleteFolder,
  renameFolder,
  getFolder,
} from "@/utils/chatAndFolderLogic";

export function useFolders(baseNames, contextMenu, isEditing) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const onCreate = async (callerContext) => {
    const id = contextMenu.value.folderId;

    const [newFolders, newFolderId, newParentFolderId] = createFolder(
      folders.value,
      callerContext === "context-menu" ? id : 0,
      baseNames.value
    );

    if (callerContext === "context-menu") {
      const newChats = chats.value.map((chat) =>
        chat.folderId === id ? { ...chat, folderId: newParentFolderId } : chat
      );
      setChats(newChats);
    }

    contextMenu.value = {
      ...contextMenu.value,
      isOpen: false,
      folderId: newFolderId,
    };

    await setFolders(newFolders);

    isEditing.value = true;
    await nextTick();
    getChatOrFolderInput("folder", newFolderId).focus();
  };

  const onDelete = async () => {
    const id = contextMenu.value.folderId;

    const newFolders = deleteFolder(folders.value, id);
    const newChats = chats.value.map((item) =>
      item.folderId === id ? { ...item, folderId: null } : item
    );

    const newNames = getBaseFolderNames(newFolders, []);
    baseNames.value = newNames.sort(sortBaseNames);

    await setChats(newChats);
    await setFolders(newFolders);

    contextMenu.value = { ...contextMenu.value, isOpen: false };
  };

  const onRename = async (newName, id) => {
    if (!newName) return;

    const newFolder = getFolder(folders.value, id);

    if (isNameNotUnique(folders.value, newName) && newName !== newFolder.name) {
      isEditing.value = false;
      return;
    }

    const isBaseName = !!newName.match(/^Untitled( \d+)?$/)?.[0];
    if (isBaseName) {
      baseNames.value = [...baseNames.value, newName].sort(sortBaseNames);
    }

    const newFolders = renameFolder(folders.value, id, newName);
    const newNames = getBaseFolderNames(newFolders, []);
    baseNames.value = newNames.sort(sortBaseNames);

    setFolders(newFolders);
    isEditing.value = false;
  };

  const prepareForRename = async () => {
    const id = contextMenu.value.folderId;

    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };

    await nextTick();
    getChatOrFolderInput("folder", id).focus();
  };

  return {
    folders,
    setFolders,
    onCreate,
    onDelete,
    onRename,
    prepareForRename,
  };
}
