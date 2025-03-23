import { createApp } from "vue";
import { classNames } from "@/variables.js";
import { setObservationType, observationType, names } from "./state.js";
import { handleRenameFromList, saveChatNameFromInput, handleChatDeletion } from "./handlers.js";
import App from "@/App.vue";
// import sidebarWidthResizing from "./utils/sidebarWidthResizing.js";

const { LIST_ROOT, CHAT, CHAT_TEXT, SIDEBAR } = classNames;
const htmlElType = "[object HTMLDivElement]";
const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const insertAppToDeepseek = () => {
  const deepseekContainer = document.querySelector(LIST_ROOT);
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount(`#${appContainer.id}`);
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "chatDeleted") {
    console.log("Чат удалён, обновляем DOM...");
    insertAppToDeepseek();
  }
});

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

    console.log(removed);

    switch (observationType) {
      case "renameFromFolder":
        const chatTextEl = removed.querySelector(CHAT_TEXT);
        if (chatTextEl.textContent === names.prev) return;
        setObservationType("");
        break;
      case "deleteFromList":
        await handleChatDeletion();
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
      await saveChatNameFromInput();
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

export { insertAppToDeepseek, observer };