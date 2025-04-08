import { nextTick } from "vue";
import { useStorage } from "./useStorage";
import { createFolder, deleteFolder } from "@/utils/chatAndFolderLogic";
import { getBaseFolderNames, sortBaseNames } from "@/utils/baseFolderNames";

const inputClassname = "folder-name__input";

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
    isEditing.value = true;
    contextMenu.value = { ...contextMenu.value, isOpen: false };
    await nextTick();
    document.querySelector(`.${inputClassname}`).focus();
  };

  return {
    chats,
    folders,
    setFolders,
    setChats,
    onCreate,
    onDelete,
    onRename,
  };
}
