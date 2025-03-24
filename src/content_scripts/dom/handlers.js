import { getData } from "@/storage";
import { classNames } from "@/variables.js";
import { renameChat, deleteChat } from "@/utils/chatAndFolderLogic.js";
import {
  showDSContextMenu,
  simulateContextMenuAction,
} from "@/utils/helpers.js";
import {
  setObservationType,
  observationType,
  names,
  setNames,
} from "./state.js";

const { CHAT_TEXT, CHAT_INPUT, DELETE_BTN } = classNames;
let chatId = "";

export const renameDSChat = () =>
  setTimeout(() => {
    const input = document.querySelector(
      `input.${CHAT_INPUT}[value="${names.prev}"]`
    );
    input.value = names.new;
    input.blur();
    setObservationType("");
  }, 100);

export const saveChatNameFromInput = () => {
  setObservationType("renameFromList");
  const input = document.querySelector(`.${CHAT_INPUT}`);
  setNames(input.value, "");
  return;
};

export const handleRenameFromList = async (el) => {
  const { folders, chats } = await getData();
  const chatEl = el.querySelector(`.${CHAT_TEXT}`);
  const chat = chats.find((item) => item.name === names.prev);
  const newFolders = folders
    ? renameChat(folders, chat.id, chatEl.textContent)
    : [];
  const newChats = chats.map((item) =>
    item.id === chat.id ? { ...item, name: chatEl.textContent } : item
  );

  if (folders) {
    await chrome.storage.sync.set({ folders: newFolders });
  }
  await chrome.storage.sync.set({ chats: newChats });
  setObservationType("");
};

export const handleChatDeletion = async (id) => {
  const { folders, chats } = await getData();

  if (observationType === "deleteFromFolder") {
    chatId = id;
    const chat = chats.find((item) => item.id === id);
    showDSContextMenu(chat.name);
    setTimeout(() => {
      simulateContextMenuAction(DELETE_BTN);
      setObservationType("deleteFromList");
    }, 100);
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
