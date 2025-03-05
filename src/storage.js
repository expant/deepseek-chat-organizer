import { generateId } from "./utils/helpers.js";
import { LIST_ROOT_CLASS_NAME, CHAT_EL_CLASS_NAME } from "./variables.js";
import { deleteChatFromFolder } from "@/background/background.js";
import { convertObjToArrDeep } from "@/utils/helpers.js";

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
  await chrome.storage.local.set({ chats: newChats });
};

export const loadFolders = async () => {
  const { chats } = await chrome.storage.local.get(["chats"]);
  const { folders: foldersObj } = await chrome.storage.local.get(["folders"]);
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
  await chrome.storage.local.set({ folders: getNewFolders(folders) });
};
