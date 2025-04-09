import { nextTick } from "vue";
import { useStorage } from "./useStorage";
import { isNameNotUnique } from "@/utils/helpers.js";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames";
import {
  createFolder,
  deleteFolder,
  renameFolder,
  getFolder,
} from "@/utils/chatAndFolderLogic";

const inputClassname = "folder-name__input";

export function useFolders(baseNames, contextMenu, isEditing) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const showDots = ref(false);
  const inputRef = ref(null);
  const folderRef = ref(null);

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
    document.querySelector(`.${inputClassname}`).focus();
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

  const onRename = async () => {
    if (!inputRef.value) return;

    const newFolder = getFolder(folders.value, contextMenu.value.folderId);
    const inputValue = inputRef.value.value.trim();

    if (
      isNameNotUnique(folders.value, inputValue) &&
      inputValue !== newFolder.name
    ) {
      isEditing.value = false;
      return;
    }

    const isBaseName = inputValue.match(/^Untitled( \d+)?$/)[0];
    if (isBaseName) {
      baseNames.value = [...baseNames.value, inputValue].sort(sortBaseNames);
    }

    const newFolders = renameFolder(folders.value, props.id, inputValue);
    setFolders(newFolders);
    isEditing.value = false;
  };

  const prepareForRename = async () => {
    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    await nextTick();
    document.querySelector(`.${inputClassname}`).focus();
  };

  return {
    showDots,
    folderRef,
    inputRef,
    chats,
    folders,
    setFolders,
    setChats,
    onCreate,
    onDelete,
    onRename,
    prepareForRename,
  };
}
