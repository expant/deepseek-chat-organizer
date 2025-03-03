import { generateId } from "./utils/helpers.js";
import { LIST_ROOT_CLASS_NAME, CHAT_EL_CLASS_NAME } from "./variables.js";
import { deleteChatFromFolder } from "@/background/background.js";

// TODO: Наблюдение через Observer за списком чатов
export const initChatsInStorage = async (chats) => {
  const elements = document.querySelectorAll(CHAT_EL_CLASS_NAME);
  const chatsWithFolderId = chats.filter((chat) => chat.folderId);
  console.log("chatsWithFolderId: ", chatsWithFolderId);
  console.log(Object.entries(elements));
  const chatData = Object.entries(elements).map(([_, el]) => {
    const chatWithFolderId = chatsWithFolderId.find((chat) => {
      console.log(`${JSON.stringify(el)} - ${chat.folderId}`);
      return el.folderId === chat.folderId;
    });

    console.log("chatWithFolderId: ", chatWithFolderId);

    return {
      id: generateId(),
      name: el.textContent,
      folderId: chatWithFolderId ? chatWithFolderId.folderId : null,
    };
  });
  await chrome.storage.local.set({ chats: chatData });
};
