import { generateId, convertObjToArrDeep } from "./utils/helpers.js";
import { classNames } from "./variables.js";

export const getChatsFromDomElements = (chats) => {
  const elements = document.querySelectorAll(`.${classNames.CHAT_TEXT}`);
  const entries = Object.entries(elements);

  return entries.map(([_, el]) => {
    const chat = chats.find((item) => item.name === el.textContent);
    const isActive = el.closest(`.${classNames.CHAT_ACTIVE}`) ? true : false;

    if (chat) return chat;
    return {
      id: generateId(),
      name: el.textContent,
      folderId: null,
      isActive,
    };
  });
};

// export const loadFolders = async () => {
//   // const { chats } = await chrome.storage.sync.get(["chats"]);
//   // const { folders: foldersObj } = await chrome.storage.sync.get(["folders"]);

//   // if (!foldersObj) return;

//   // const folders = convertObjToArrDeep(foldersObj, "folders");

//   await chrome.storage.sync.set({
//     folders: filterFoldersByExistingChats(folders, chats),
//   });
// };

// export const initData = async () => {
//   const { chats } = await chrome.storage.sync.get(["chats"]);

//   await loadFolders();

//   const { folders } = await chrome.storage.sync.get(["folders"]);
//   const { chats: newChats } = await chrome.storage.sync.get(["chats"]);
//   return { folders, chats: newChats };
// };

export const getDeepStorageArray = async (key) => {
  const data = await chrome.storage.sync.get([key]);
  return convertObjToArrDeep(data[key], key);
};

// export const getData = async () => {
//   const { folders: foldersObj } = await chrome.storage.sync.get(["folders"]);
//   const { chats: chatsObj } = await chrome.storage.sync.get(["chats"]);

//   const folders = convertObjToArrDeep(foldersObj, "folders");
//   const chats = convertObjToArrDeep(chatsObj, "chats");
//   return { folders, chats }
// };
