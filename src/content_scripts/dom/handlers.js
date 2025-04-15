import { getDeepStorageArray, getChatsFromDomElements } from "@/storage";
import { classNames } from "@/constants.js";
import {
  renameChat,
  deleteChat,
  setActiveChatInFolders,
  setActiveChatInChatList,
  filterFoldersByExistingChats,
} from "@/utils/chatAndFolderLogic.js";
import {
  showDSContextMenu,
  simulateContextMenuAction,
} from "@/utils/helpers.js";
import {
  setObservationType,
  observationType,
  names,
  setNames,
  emitter,
} from "./state.js";

const { CHAT, UI } = classNames;
let chatId = "";

export const renameDSChat = () =>
  setTimeout(() => {
    const input = document.querySelector(
      `input.${CHAT.INPUT}[value="${names.prev}"]`
    );

    input.value = names.new;
    input.blur();

    setObservationType("");
  }, 100);

export const saveChatNameFromInput = () => {
  setObservationType("renameFromList");

  const input = document.querySelector(`.${CHAT.INPUT}`);

  setNames(input.value, "");
  return;
};

export const handleRenameFromList = async (el) => {
  const folders = await getDeepStorageArray("folders");
  const chats = await getDeepStorageArray("chats");

  const chatEl = el.querySelector(`.${CHAT.TITLE}`);
  const chat = chats.find((item) => item.name === names.prev);

  const newFolders = renameChat(folders, chat.id, chatEl.textContent);
  const newChats = chats.map((item) =>
    item.id === chat.id ? { ...item, name: chatEl.textContent } : item
  );

  if (folders) {
    await chrome.storage.sync.set({ folders: newFolders });
    emitter.emit("updateFolders", newFolders);
  }
  await chrome.storage.sync.set({ chats: newChats });
  emitter.emit("updateChats", newChats);

  setObservationType("");
};

export const updateData = async () => {
  const chats = await getDeepStorageArray("chats");
  const folders = await getDeepStorageArray("folders");

  const newChats = getChatsFromDomElements(chats);
  const newFolders = filterFoldersByExistingChats(folders, newChats);

  emitter.emit("updateChats", newChats);
  if (!newFolders) return;
  emitter.emit("updateFolders", newFolders);
};

export const handleChatDeletion = async (id) => {
  const folders = await getDeepStorageArray("folders");
  const chats = await getDeepStorageArray("chats");

  if (observationType === "deleteFromFolder") {
    chatId = id;
    const chat = chats.find((item) => item.id === id);

    showDSContextMenu(chat.name);
    setTimeout(() => {
      simulateContextMenuAction(UI.DELETE_BTN);
      setObservationType("deleteFromList");
    }, 100);
    return;
  }

  if (observationType === "deleteFromList") {
    const newFolders = deleteChat(folders, chatId);
    const newChats = chats.filter((item) => item.id !== chatId);

    await chrome.storage.sync.set({ chats: newChats });
    await chrome.storage.sync.set({ folders: newFolders });

    emitter.emit("updateChats", newChats);
    emitter.emit("updateFolders", newFolders);

    setObservationType("");
  }
};

export const handleActiveChat = async (el) => {
  const chatTextEl = el.querySelector(`.${CHAT.TITLE}`);
  const folders = await getDeepStorageArray("folders");
  const chats = await getDeepStorageArray("chats");

  if (folders) {
    const newFolders = setActiveChatInFolders(folders, chatTextEl.textContent);
    await chrome.storage.sync.set({ folders: newFolders });
    emitter.emit("updateFolders", newFolders);
  }

  if (chats) {
    const newChats = setActiveChatInChatList(chats, chatTextEl.textContent);
    await chrome.storage.sync.set({ chats: newChats });
    emitter.emit("updateChats", newChats);
  }
};
