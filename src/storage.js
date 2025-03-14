import { generateId } from "./utils/helpers.js";
import { CHAT_EL_CLASS_NAME } from "./variables.js";
import { convertObjToArrDeep } from "@/utils/helpers.js";
// import { deleteChatFromFolder } from "@/background/background.js";

// TODO: Наблюдение через Observer за списком чатов
export const initChatsInStorage = async (chats) => {
  const elements = document.querySelectorAll(CHAT_EL_CLASS_NAME);
  const newChats = Object.entries(elements).map(([_, el]) => {
    const chat = chats.find((item) => item.name === el.textContent);
    return chat
      ? chat
      : {
          id: generateId(),
          name: el.textContent,
          folderId: null,
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
