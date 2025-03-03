import { generateId } from "./utils/helpers.js";
import { LIST_ROOT_CLASS_NAME, CHAT_EL_CLASS_NAME } from "./variables.js";
import { deleteChatFromFolder } from "@/background/background.js";

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
      }
  });
  await chrome.storage.local.set({ chats: newChats });
};