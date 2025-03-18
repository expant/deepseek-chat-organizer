import { createApp } from "vue";
import {
  LIST_ROOT_CLASS_NAME,
  SIDEBAR_CLASS_NAME,
  CHAT_CLASS_NAME,
  CHAT_CLASS_NAME_TEXT,
} from "./variables.js";
import {
  setObservationType,
  observationType,
} from "./background/observers/common.js";
import {
  names,
  handleRenameFromList,
} from "@/background/observers/renameChat.js";
import sidebarWidthResizing from "./utils/sidebarWidthResizing.js";
import App from "./App.vue";
import { handleDeleteChat } from "./background/observers/deleteChat.js";

// Подключаем CSS-файл --------------------
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("assets/styles.css");
document.head.appendChild(link);
// ----------------------------------------
const targetEl = document.querySelector("#root");
const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const insertAppToDeepseek = () => {
  const deepseekContainer = document.querySelector(LIST_ROOT_CLASS_NAME);
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

  if (removed) {
    // mutation.target.className === "d4b5352e" &&
    if (removed.className === `.${CHAT_CLASS_NAME}`) {
      if (observationType === "renameFromFolder") {
        const chatTextEl = removed.querySelector(CHAT_CLASS_NAME_TEXT);
        if (chatTextEl.textContent === names.prev) return;
        setObservationType("");
      } else {
        handleDeleteChat({ mutation });
      }
      insertAppToDeepseek();
      return;
    }
  }

  console.log(mutation);

  if (added) {
    if (
      added.classList.contains("ds-input") &&
      observationType !== "renameFromFolder"
    ) {
      handleRenameFromList();
      return;
    }

    if (observationType === "renameFromList") {
      await handleRenameFromList(added);
      insertAppToDeepseek();
      return;
    }
  }

  if (mutation.target.className === SIDEBAR_CLASS_NAME) {
    if (mutation.addedNodes.length > 0) {
      console.log("variant 3");
      insertAppToDeepseek();
      // setTimeout(() => sidebarWidthResizing(), 500);
    }
  }
};

// TODO: Отслеживать переименование и удаление чатов
const callback = async (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    await handleMutation(mutation);
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
