import { LIST_ROOT_CLASS_NAME, CHAT_EL_CLASS_NAME } from "./variables.js";

// TODO: Наблюдение через Observer за списком чатов
export const initChatsInStorage = async (chats) => {
  const elements = document.querySelectorAll(CHAT_EL_CLASS_NAME);
  const chatsWithFolderId = chats.filter((chat) => chat.folderId);
  const chatData = Object.entries(elements).map(([id, el]) => {
    const chatWithFolderId = chatsWithFolderId.find(
      (chat) => chat.id === parseInt(id)
    );

    return {
      id: parseInt(id),
      name: el.textContent,
      folderId: chatWithFolderId ? chatWithFolderId.folderId : null,
    };
  });
  await chrome.storage.local.set({ chats: chatData });
};
