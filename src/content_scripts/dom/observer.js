import { createApp } from "vue";
import { classNames } from "@/variables.js";
import {
  setObservationType,
  observationType,
  names,
  emitter,
} from "./state.js";
import {
  saveChatNameFromInput,
  handleRenameFromList,
  handleChatDeletion,
  handleActiveChat,
  updateData,
} from "./handlers.js";
import App from "@/App.vue";

const { LIST_ROOT, CHAT, CHAT_TEXT, CHAT_LIST_EMPTY, SIDEBAR, CHAT_ACTIVE } =
  classNames;
const htmlElType = "[object HTMLDivElement]";
let debounceTimer = null;

const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const insertAppToDeepseek = () => {
  const deepseekContainer = document.querySelector(LIST_ROOT);

  if (deepseekContainer.classList.contains(CHAT_LIST_EMPTY)) {
    deepseekContainer.classList.add("content-alignment");
  }

  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount(`#${appContainer.id}`);
  }
};

const handleMutation = async (mutation) => {
  const added = mutation.addedNodes[0];
  const removed = mutation.removedNodes[0];
  const addedType = Object.prototype.toString.call(added);
  const removedType = Object.prototype.toString.call(removed);

  if (added instanceof Comment) return;
  if (removed instanceof Comment) return;

  if (mutation.type === "characterData") {
    const parentElement = mutation.target.parentElement;
    const isChatTitle = parentElement.classList.contains(CHAT_TEXT);

    if (!isChatTitle || debounceTimer) return;

    debounceTimer = setTimeout(() => {
      insertAppToDeepseek();
      debounceTimer = null;
    }, 500);
  }

  if (mutation.type === "attributes") {
    const targetClassList = mutation.target.classList;

    if (targetClassList.contains(CHAT_ACTIVE)) {
      handleActiveChat(mutation.target);
    }

    if (targetClassList.contains("dark")) {
      emitter.emit("updateTheme", "dark");
    }
    if (targetClassList.contains("light")) {
      emitter.emit("updateTheme", "light");
    }
  }

  if (mutation.previousSibling && added) {
    if (mutation.previousSibling.className === "ebaea5d2") {
      insertAppToDeepseek();
      return;
    }
    if (added.classList?.contains(CHAT_LIST_EMPTY)) {
      added.parentElement.classList.add("content-alignment");
    }
  }

  if (removedType === htmlElType) {
    if (!removed.classList.contains(CHAT)) return;

    switch (observationType) {
      case "renameFromFolder":
        const chatTextEl = removed.querySelector(`.${CHAT_TEXT}`);
        if (chatTextEl.textContent === names.prev) return;
        setObservationType("");
        break;
      case "deleteFromList":
        await handleChatDeletion();
        break;
      default:
        return;
    }
  }

  if (addedType === htmlElType) {
    if (
      added.classList.contains("ds-input") &&
      observationType !== "renameFromFolder"
    ) {
      await saveChatNameFromInput();
      return;
    }

    if (
      observationType === "renameFromList" &&
      added.classList.contains(CHAT)
    ) {
      await handleRenameFromList(added);
      return;
    }
  }

  if (mutation.target.className === SIDEBAR) {
    if (mutation.addedNodes.length > 0) {
      insertAppToDeepseek();
    }
  }
};

const callback = async (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    await handleMutation(mutation);
  }
};

const observer = new MutationObserver(callback);
const config = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true,
};

chrome.storage.local.get(["extensionEnabled"], (result) => {
  if (result.extensionEnabled) {
    observer.observe(document.body, config);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggle") {
    if (message.state === true) {
      insertAppToDeepseek();
      observer.observe(document.body, config);
      return;
    }
    appContainer.remove();
    observer.disconnect();
  }

  if (message.action === "chatDeleted") {
    updateData();
  }
});

export { insertAppToDeepseek, observer };
