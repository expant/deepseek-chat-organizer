import { getData } from "@/storage";
import { deleteChat } from "@/background/background";
import { getDSChatEl, getDSContextMenu } from "@/utils/helpers.js";
import { setObservationType, observationType } from "./common.js";
import { classNames } from "@/variables.js";

let chatId = "";

const openMenu = (chatName) => {
  console.log(chatName);
  const el = getDSChatEl(chatName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();
};

const handleBtnDelete = () => {
  const menu = getDSContextMenu();
  const deleteBtn = menu.querySelector(`.${classNames.DELETE_BTN}`);
  deleteBtn.click();
  setObservationType("deleteFromList");
};

export const handleDeleteChat = async (id) => {
  const { folders, chats } = await getData();

  if (observationType === "deleteFromFolder") {
    chatId = id;
    const chat = chats.find((item) => item.id === id);
    openMenu(chat.name);
    setTimeout(() => handleBtnDelete(), 100);
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
