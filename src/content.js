import { createApp } from "vue";
import { LIST_ROOT_CLASS_NAME, SIDEBAR_CLASS_NAME } from "./variables.js";
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

const insertAppToDeepseek = (deepseekContainer) => {
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount("#folders-list");
  }
};

// TODO: Отслеживать переименование и удаление чатов
const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.addedNodes[0] instanceof Comment) return;

    if (mutation.target.className === SIDEBAR_CLASS_NAME) {
      if (mutation.addedNodes.length > 0) {
        const deepseekContainer =
          mutation.addedNodes[0].querySelector(LIST_ROOT_CLASS_NAME);
        insertAppToDeepseek(deepseekContainer);
      }
    }
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
