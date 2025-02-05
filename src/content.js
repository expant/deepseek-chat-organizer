import { createApp } from "vue";
import App from "./App.vue";
// Подключаем CSS-файл
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("assets/styles.css");
document.head.appendChild(link);

const DEEPSEEK_SELECTOR = ".fb0a63fb";
const targetEl = document.querySelector(".dc04ec1d");
const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const insertAppToDeepseek = (deepseekContainer) => {
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(App).mount("#folders-list");
  }
};

// TODO: Добавить условие для очистки setTimeOut
const watchForDeepseekEl = (cb) => {
  const existingDeepseek = targetEl.querySelector(DEEPSEEK_SELECTOR);
  if (!existingDeepseek) {
    setTimeout(() => watchForDeepseekEl(cb), 500);
    return;
  }
  return cb(existingDeepseek);
};
watchForDeepseekEl(insertAppToDeepseek);

const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length) {
      const deepseekContainer =
        mutation.addedNodes[0].querySelector(DEEPSEEK_SELECTOR);
      insertAppToDeepseek(deepseekContainer);
    }
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
