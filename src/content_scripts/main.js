import { observer } from "./dom/observer";

// Подключаем CSS-файл --------------------
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("assets/styles.css");
document.head.appendChild(link);
// ----------------------------------------
// const targetEl = document.querySelector("#root");
const config = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true,
};
observer.observe(document.body, config);
