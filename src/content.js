import { createApp } from "vue";
import { classNames } from "./variables.js";
import { handleDeleteChat } from "./background/observers/deleteChat.js";
import {
  setObservationType,
  observationType,
} from "./background/observers/common.js";
import {
  names,
  handleRenameFromList,
} from "@/background/observers/renameChat.js";
// import sidebarWidthResizing from "./utils/sidebarWidthResizing.js";
import App from "./App.vue";

// Подключаем CSS-файл --------------------
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("assets/styles.css");
document.head.appendChild(link);
// ----------------------------------------
const targetEl = document.querySelector("#root");
const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const prevMutation = { removed: {}, added: {} };
const { LIST_ROOT, CHAT, CHAT_TEXT, SIDEBAR, MODAL_DELETE } = classNames;

const insertAppToDeepseek = () => {
  const deepseekContainer = document.querySelector(LIST_ROOT);
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount("#folders-list");
  }
};

const handleMutation = async (mutation) => {
  const added = mutation.addedNodes[0];
  const removed = mutation.removedNodes[0];
  if (added instanceof Comment) return;

  if (mutation.previousSibling && added) {
    if (mutation.previousSibling.className === "ebaea5d2") {
      console.log("variant 1");
      insertAppToDeepseek();
      return;
    }
  }

  // if (removed && added) {
  //   if (removed.classList.contains(CHAT) && added)
  // }

  if (removed) {
    // mutation.target.className === "d4b5352e" &&
    console.log(removed);
    if (removed.classList.contains(CHAT)) {
      console.log("removed: ", mutation);
      prevMutation.removed = removed;

      if (observationType === "renameFromFolder") {
        const chatTextEl = removed.querySelector(CHAT_TEXT);
        if (chatTextEl.textContent === names.prev) return;
        setObservationType("");
        insertAppToDeepseek();
      } else if (observationType === "deleteFromList") {
        await handleDeleteChat();
        insertAppToDeepseek();
      }
      return;
    }
  }

  if (added) {
    if (added.nodeType === Node.TEXT_NODE) {
      return;
    }

    // console.log(observationType);
    // console.log("added: ", mutation);
    if (added.classList.contains(CHAT)) {
      prevMutation.added = added;
    }

    if (
      added.classList.contains("ds-input") &&
      observationType !== "renameFromFolder"
    ) {
      console.log("событие: ", mutation);
      await handleRenameFromList();
      return;
    }

    if (
      observationType === "renameFromList" &&
      added.classList.contains(CHAT)
    ) {
      console.log("Выполняется после");
      await handleRenameFromList(added);
      insertAppToDeepseek();
      return;
    }
  }

  if (mutation.target.className === SIDEBAR) {
    if (mutation.addedNodes.length > 0) {
      insertAppToDeepseek();
      // setTimeout(() => sidebarWidthResizing(), 500);
    }
  }
};

const callback = async (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    await handleMutation(mutation);
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
