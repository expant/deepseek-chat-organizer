import { setObservationType, observationType } from "./common.js";
import { CHAT_EL_CLASS_NAME } from "@/variables.js";
import { renameChat } from "../background.js";
import { getData } from "@/storage";

const inputClassName = "ds-input__input";
const menuClassName = "ds-floating-position-wrapper";
const renameBtnClassName = "ds-dropdown-menu-option--none";

export const names = { prev: "", new: "" };
export const setNames = (prevName, newName) => {
  names.prev = prevName;
  names.new = newName;
};

const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    renameDSChat(mutation);
  }
};

export const observer = new MutationObserver(callback);

export const renameDSChat = (mutation) => {
  if (
    !mutation.addedNodes[0] &&
    !mutation.target.classList.contains(menuClassName)
  )
    return;

  console.log("variant 4");

  const el1 = mutation.addedNodes[0];
  const el2 = mutation.target;
  const isMenuEl1 = el1.classList.contains(menuClassName);
  const menuEl = isMenuEl1 ? el1 : el2;
  const renameBtn = menuEl.querySelector(`.${renameBtnClassName}`);
  renameBtn.click();

  setTimeout(() => {
    const input = document.querySelector(
      `input.${inputClassName}[value="${names.prev}"]`
    );
    input.value = names.new;
    input.blur();
  }, 100);
  observer.disconnect();
};

export const handleRenameFromList = async (el) => {
  if (observationType !== "renameFromList") {
    setObservationType("renameFromList");
    const input = document.querySelector(`.${inputClassName}`);
    setNames(input.value, "");
    return;
  }

  const { folders, chats } = await getData();
  const chatEl = el.querySelector(CHAT_EL_CLASS_NAME);
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
