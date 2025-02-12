import { getNewUntitled } from "./utils/helpers.js";

export const renameFolder = (folders, id, name) =>
  folders.map((item) => {
    if (typeof item === "string") return item;
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
    if (typeof item === "string") return true;
    if (item.id === id) return false;
    if (item.children) {
      item.children = deleteFolder(item.children, id);
      return true;
    }
  });

export const createFolder = (folders, id, baseNames) => {
  let newFolderId = 0;
  const name = getNewUntitled(baseNames);

  const getNewFolders = (items) => items.map((item) => {
    if (typeof item === "string") return item;
    if (item.id === id) {
      const newFolder = {
        id: Date.now(),
        type: "folder",
        isOpen: false,
        children: [],
        name,
      };
      item.isOpen = true;
      item.children.unshift(newFolder);
      newFolderId = newFolder.id;
      return item;
    };
    return item.children ? { ...item, children: getNewFolders(item.children) } : item;
  });
  return [getNewFolders(folders), newFolderId];
};