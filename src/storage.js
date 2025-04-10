import { classNames } from "./variables.js";
import { generateId, convertObjToArrDeep } from "./utils/helpers.js";

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

export const getDeepStorageArray = async (key) => {
  const data = await chrome.storage.sync.get([key]);
  return convertObjToArrDeep(data[key], key);
};
