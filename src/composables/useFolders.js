import { nextTick, inject } from "vue";
import { useStorage } from "./useStorage";
import { isNameNotUnique, getChatOrFolderInput } from "@/utils/helpers.js";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames";
import {
  createFolder,
  deleteFolder,
  renameFolder,
  getFolder,
} from "@/utils/chatAndFolderLogic";

export function useFolders(
  contextMenu = null,
  baseNames = null,
  isEditing = null
) {
  const folderMenu = contextMenu || inject("folderMenu");
  const baseFolderNames = baseNames || inject("baseFolderNames");
  const isEditingFolderName = isEditing || inject("isEditingFolderName");

  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const onCreate = async (callerContext) => {
    const id = folderMenu.value.id;

    const [newFolders, newFolderId, newParentFolderId] = createFolder(
      folders.value,
      callerContext === "context-menu" ? id : 0,
      baseFolderNames.value
    );

    if (callerContext === "context-menu") {
      const newChats = chats.value.map((chat) =>
        chat.folderId === id ? { ...chat, folderId: newParentFolderId } : chat
      );
      setChats(newChats);
    }

    folderMenu.value = {
      ...folderMenu.value,
      isOpen: false,
      id: newFolderId,
    };

    console.log("newFolders: ", newFolders);
    console.log("new folder: ", newFolders?.[0].children);

    await setFolders(newFolders);

    isEditingFolderName.value = true;
    await nextTick();
    getChatOrFolderInput("folder", newFolderId).focus();
  };

  const onDelete = async () => {
    const id = folderMenu.value.id;

    const newFolders = deleteFolder(folders.value, id);
    const newChats = chats.value.map((item) =>
      item.folderId === id ? { ...item, folderId: null } : item
    );

    const newNames = getBaseFolderNames(newFolders, []);
    baseFolderNames.value = newNames.sort(sortBaseNames);

    await setChats(newChats);
    await setFolders(newFolders);

    folderMenu.value = { ...folderMenu.value, isOpen: false };
  };

  const onRename = async (newName, id) => {
    if (!newName) return;

    // console.log("folders.value и id ------------");
    // console.log(folders.value, id);
  
    const newFolder = getFolder(folders.value, id);

    // console.log(newName, newFolder);

    if (isNameNotUnique(folders.value, newName) && newName !== newFolder.name) {
      isEditingFolderName.value = false;
      return;
    }

    console.log(`New name: `, newName);

    const isBaseName = !!newName.match(/^Untitled( \d+)?$/)?.[0];
    if (isBaseName) {
      baseFolderNames.value = [...baseFolderNames.value, newName].sort(
        sortBaseNames
      );

      console.log("new baseFolderNames: ", baseFolderNames.value)
    }

    const newFolders = renameFolder(folders.value, id, newName);
    const newNames = getBaseFolderNames(newFolders, []);
    baseFolderNames.value = newNames.sort(sortBaseNames);

    setFolders(newFolders);
    isEditingFolderName.value = false;
  };

  const prepareForRename = async () => {
    const id = folderMenu.value.id;

    isEditingFolderName.value = true;
    folderMenu.value = { ...folderMenu.value, isOpen: false };

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
