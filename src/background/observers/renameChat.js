import { setObservationType, observationType } from "./common.js";
import { CHAT_CLASS_NAME_TEXT } from "@/variables.js";
import { renameChat } from "../background.js";
import { getData } from "@/storage";

const inputClassName = "ds-input__input";

export const names = { prev: "", new: "" };
export const setNames = (prevName, newName) => {
  names.prev = prevName;
  names.new = newName;
};

export const renameDSChat = () => {
  setTimeout(() => {
    const input = document.querySelector(
      `input.${inputClassName}[value="${names.prev}"]`
    );
    input.value = names.new;
    input.blur();
  }, 100);
};

export const handleRenameFromList = async (el) => {
  if (observationType !== "renameFromList") {
    setObservationType("renameFromList");
    const input = document.querySelector(`.${inputClassName}`);
    setNames(input.value, "");
    return;
  }

  const { folders, chats } = await getData();
  const chatEl = el.querySelector(CHAT_CLASS_NAME_TEXT);
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
