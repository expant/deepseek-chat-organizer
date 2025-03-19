import { getData } from "@/storage";
import { deleteChat } from "@/background/background";
import { getDSChatEl } from "@/utils/helpers.js";
import { setObservationType, observationType, observer } from "./common.js";

let chatId = "";

const openMenu = (chatName) => {
  console.log(chatName);
  const el = getDSChatEl(chatName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();
};

export const handleDeleteChat = async (id) => {
  const { folders, chats } = await getData();

  if (observationType === "deleteFromFolder") {
    chatId = id;
    const chat = chats.find((item) => item.id === id);
    observer.observe(document.body, { childList: true });
    openMenu(chat.name);
    return;
  }

  if (observationType === "deleteFromList") {
    const newFolders = deleteChat(folders, chatId);
    const newChats = chats.filter((item) => item.id !== chatId);
    await chrome.storage.sync.set({ chats: newChats });
    await chrome.storage.sync.set({ folders: newFolders });
    setObservationType("");
  }
};
