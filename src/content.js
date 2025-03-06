import { createApp } from "vue";
import { LIST_ROOT_CLASS_NAME, SIDEBAR_CLASS_NAME } from "./variables.js";
import App from "./App.vue";
import sidebarWidthResizing from "./utils/sidebarWidthResizing.js";

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

    // console.log(mutation.previousSibling && el);

    // const isChatsLoaded =
    //   mutation.previousSibling && el
    //     ? mutation.previousSibling.className === "ebaea5d2"
    //     : false;
    // const isSideBarOpened =
    //   mutation.target.className === SIDEBAR_CLASS_NAME &&
    //   mutation.addedNodes.length > 0;

    // if (!isChatsLoaded && !isSideBarOpened) return;
    // insertAppToDeepseek();

    if (mutation.previousSibling && el) {
      if (mutation.previousSibling.className === "ebaea5d2") {
        insertAppToDeepseek();
        return;
      }
    }

    if (mutation.target.className === SIDEBAR_CLASS_NAME) {
      if (mutation.addedNodes.length > 0) {
        insertAppToDeepseek();
        setTimeout(() => sidebarWidthResizing(), 500);
      }
    }
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
