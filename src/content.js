import { createApp } from "vue";
import { LIST_ROOT_CLASS_NAME, SIDEBAR_CLASS_NAME } from "./variables.js";
import sidebarWidthResizing from "./utils/sidebarWidthResizing.js";
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

const insertAppToDeepseek = () => {
  const deepseekContainer = document.querySelector(LIST_ROOT_CLASS_NAME);
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount("#folders-list");
  }
};

// TODO: Отслеживать переименование и удаление чатов
const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    const el = mutation.addedNodes[0];
    if (el instanceof Comment) return;

    if (mutation.previousSibling && el) {
      if (mutation.previousSibling.className === "ebaea5d2") {
        console.log("variant 1");
        insertAppToDeepseek();
        return;
      }
    }

    if (mutation.removedNodes[0]) {
      if (
        mutation.target.className === "d4b5352e" &&
        mutation.removedNodes[0].className === "f9edaa3c"
      ) {
        console.log("variant 2");
        insertAppToDeepseek();

        // insertAppToDeepseek();
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
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
