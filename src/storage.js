import { generateId, convertObjToArrDeep } from "./utils/helpers.js";
import { classNames } from "./variables.js";

export const initChatsInStorage = async (chats) => {
  const elements = document.querySelectorAll(`.${classNames.CHAT_TEXT}`);
  const newChats = Object.entries(elements).map(([_, el]) => {
    const chat = chats.find((item) => item.name === el.textContent);
    const isActive = el.closest(`.${classNames.CHAT_ACTIVE}`) ? true : false;
    return chat
      ? chat
      : {
          id: generateId(),
          name: el.textContent,
          folderId: null,
          isActive,
        };
  });
  await chrome.storage.sync.set({ chats: newChats });
};

export const loadFolders = async () => {
  const { chats } = await chrome.storage.sync.get(["chats"]);
  const { folders: foldersObj } = await chrome.storage.sync.get(["folders"]);
  if (!foldersObj) return;

  const folders = convertObjToArrDeep(foldersObj, "folders");

  const getNewFolders = (items) =>
    items.filter((item) => {
      if (item.type === "folder") {
        if (!item.children) return true;
        item.children = getNewFolders(item.children);
        return true;
      }
      const chat = chats.find((chat) => chat.id === item.id);
      return chat ? true : false;
    });
  await chrome.storage.sync.set({ folders: getNewFolders(folders) });
};

export const initData = async () => {
  const { chats } = await chrome.storage.sync.get(["chats"]);

  if (!chats) {
    await initChatsInStorage([]);
  } else {
    await initChatsInStorage(convertObjToArrDeep(chats, "chats"));
  }
  await loadFolders();

  const { folders } = await chrome.storage.sync.get(["folders"]);
  const { chats: newChats } = await chrome.storage.sync.get(["chats"]);
  return { folders, chats: newChats };
};

export const getData = async () => {
  const { folders: foldersObj } = await chrome.storage.sync.get(["folders"]);
  const { chats: chatsObj } = await chrome.storage.sync.get(["chats"]);
  const folders =
    typeof foldersObj === "object"
      ? convertObjToArrDeep(foldersObj, "folders")
      : foldersObj;
  const chats =
    typeof chatsObj === "object"
      ? convertObjToArrDeep(chatsObj, "chats")
      : chatsObj;
  return { folders, chats };
};
