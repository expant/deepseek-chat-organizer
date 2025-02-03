import { createApp } from "vue";
import FoldersList from "./components/FoldersList.vue";

const targetEl = document.querySelector("#root");
const appContainer = document.createElement("div");
appContainer.id = "folders-list";

const insertAppToDeepseek = (deepseekContainer) => {
  if (deepseekContainer) {
    deepseekContainer.prepend(appContainer);
    createApp(FoldersList).mount("#folders-list");
  }
};

const watchForDeepseekEl = (cb) => {
  const existingDeepseek = targetEl.querySelector(".fb0a63fb");
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
        mutation.addedNodes[0].querySelector(".fb0a63fb");
      insertAppToDeepseek(deepseekContainer);
    }
  }
};

const observer = new MutationObserver(callback);
const config = { childList: true, subtree: true };
observer.observe(targetEl, config);
