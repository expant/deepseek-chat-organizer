import { generateId } from "./helpers";
import { getNewBaseFolderName } from "./baseFolderNames";

export const getFolder = (folders, id) =>
  folders.reduce((acc, item) => {
    if (item.type === "chat") return acc;
    if (item.id === id) return item;
    return getFolder(item.children, id);
  }, {});

export const renameFolder = (folders, id, name) =>
  folders.map((item) => {
    if (item.type === "chat") return item;
    if (id !== item.id) {
      if (item.children)
        return { ...item, children: renameFolder(item.children, id, name) };
      return item;
    }
    if (item.name !== name && name) return { ...item, name };
    return item;
  });

export const deleteFolder = (folders, id) =>
  folders.filter((item) => {
    if (item.type === "chat") return true;
    if (item.id === id) return false;
    if (item.children) {
      item.children = deleteFolder(item.children, id);
      return true;
    }
  });

export const createFolder = (folders, id, baseNames) => {
  let newFolderId = generateId();
  let newParentFolderId = generateId();

  const name = getNewBaseFolderName(baseNames);
  const newFolder = {
    id: newFolderId,
    type: "folder",
    isOpen: false,
    children: [],
    name,
  };

  if (!id) {
    folders.push(newFolder);
    return [folders, newFolderId, newParentFolderId];
  }

  const getNewFolders = (items) =>
    items.map((item) => {
      if (item.type === "chat") return item;
      if (item.id === id) {
        item = { ...item, id: newParentFolderId, isOpen: true };
        item.children.unshift(newFolder);
        item.children = item.children.map((child) =>
          child.type === "chat"
            ? { ...child, folderId: newParentFolderId }
            : child
        );
        return item;
      }
      return item.children
        ? { ...item, children: getNewFolders(item.children) }
        : item;
    });
  return [getNewFolders(folders), newFolderId, newParentFolderId];
};

export const addChatsToFolder = (chats, folders, folderId, newFolderId) =>
  folders.map((item) => {
    if (item.type === "chat") return item;
    if (item.id === folderId) {
      const newChats = chats.map((chat) => ({
        ...chat,
        folderId: newFolderId,
        type: "chat",
      }));

      const childrenChats = item.children.map((obj) =>
        obj.type === "chat" ? { ...obj, folderId: newFolderId } : obj
      );
      item.id = newFolderId;
      item.children = [...childrenChats, ...newChats];
      item.isOpen = true;
      return item;
    }
    if (!item.children) return item;

    item.children = addChatsToFolder(
      chats,
      item.children,
      folderId,
      newFolderId
    );
    return item;
  });

export const renameChat = (folders, id, name) =>
  folders.map((item) => {
    if (item.type === "chat") {
      if (item.id !== id) return item;
      return { ...item, name };
    }
    if (!item.children) return item;
    const children = renameChat(item.children, id, name);
    return { ...item, children };
  });

export const deleteChat = (folders, chatId) => {
  const result = folders.filter((item) => {
    if (item.type === "folder") {
      if (!item.children) return true;
      item.children = deleteChat(item.children, chatId);
      return true;
    }
    return item.id === chatId ? false : true;
  });
  return result;
};

export const setActiveChatInFolders = (folders, name) => {
  const result = folders.map((item) => {
    if (item.type === "chat") {
      return item.name === name
        ? { ...item, isActive: true }
        : { ...item, isActive: false };
    }
    item.children = setActiveChatInFolders(item.children, name);
    return item;
  });
  return result;
};

export const setActiveChatInChatList = (chats, name) =>
  chats.map((item) =>
    item.name === name
      ? { ...item, isActive: true }
      : { ...item, isActive: false }
  );

export const filterFoldersByExistingChats = (folders, chats) =>
  folders.filter((item) => {
    if (item.type === "folder") {
      if (!item.children) return true;
      item.children = filterFoldersByExistingChats(item.children, chats);
      return true;
    }

    const chat = chats.find((chat) => chat.id === item.id);
    return chat ? true : false;
  });

export const deleteFolderIdFromChats = (id, chats) =>
  chats.map((item) => (item.id === id ? { ...item, folderId: null } : item));