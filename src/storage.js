import { classNames } from "./constants.js";
import { generateId, convertObjToArrDeep } from "./utils/helpers.js";

const { CHAT } = classNames;

export const getChatsFromDomElements = (chats) => {
  const elements = document.querySelectorAll(`.${CHAT.TITLE}`);
  const entries = Object.entries(elements);

  return entries.map(([_, el]) => {
    const chat = chats.find((item) => item.name === el.textContent);
    const isActive = !!el.closest(`.${CHAT.ACTIVE}`);

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
