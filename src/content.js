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

const { LIST_ROOT, CHAT, CHAT_TEXT, SIDEBAR } = classNames;
const htmlElType = "[object HTMLDivElement]";

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
  const addedType = Object.prototype.toString.call(added);
  const removedType = Object.prototype.toString.call(removed);

  if (added instanceof Comment) return;
  if (removed instanceof Comment) return;

  if (mutation.previousSibling && added) {
    if (mutation.previousSibling.className === "ebaea5d2") {
      console.log("variant 1");
      insertAppToDeepseek();
      return;
    }
  }

  if (removedType === htmlElType) {
    if (!removed.classList.contains(CHAT)) return;

    // FIXME: Починить обновление папок после удаления чата ИЗ СПИСКА DS
    console.log(removed);

    switch (observationType) {
      case "renameFromFolder":
        const chatTextEl = removed.querySelector(CHAT_TEXT);
        if (chatTextEl.textContent === names.prev) return;
        setObservationType("");
        break;
      case "deleteFromList":
        await handleDeleteChat();
        break;
      default:
        return;
    }
    insertAppToDeepseek();
  }

  if (addedType === htmlElType) {
    if (
      added.classList.contains("ds-input") &&
      observationType !== "renameFromFolder"
    ) {
      await handleRenameFromList();
      return;
    }

    if (
      observationType === "renameFromList" &&
      added.classList.contains(CHAT)
    ) {
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
