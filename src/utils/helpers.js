import { classNames } from "@/constants.js";

export const getFolderNameById = (folders, id) =>
  folders.reduce((acc, item) => {
    if (acc || item.type === "chat") return acc;
    if (item.id === id) return item.name;
    if (item.children) return getFolderNameById(item.children, id);
    return acc;
  }, null);

export const getDSChatEl = (name) => {
  const { CHAT } = classNames;

  const elements = document.querySelectorAll(`.${CHAT.TITLE}`);
  const entries = Object.entries(elements);

  const [, el] = entries.find(([_, el]) => el.textContent === name);
  return el;
};

export const getDSContextMenu = () => {
  const { UI } = classNames;

  const menus = document.querySelectorAll(`.${UI.CONTEXT_MENU}`);
  const entries = Object.entries(menus);

  const [, menu] = entries.find(([, el]) => el.style.zIndex === "1024");
  return menu;
};

export const isNameNotUnique = (items, name, id) =>
  items.some((item) => {
    if (item.type === "chat") return false;
    if (item.name === name && item.id !== id) return true;
    if (item.children) return isNameNotUnique(item.children, name, id);
  });

export const isOutsideClick = (event, selector) => {
  const element = document.querySelector(selector);

  if (element && !element.contains(event.target)) {
    return false;
  }
  return true;
};

export const convertObjToArrDeep = (object, type) => {
  if (typeof object !== "object") {
    return object;
  }

  const arr = Object.values(object);

  switch (type) {
    case "folders": {
      return arr.map((item) => {
        if (item.type === "chat") return item;
        item.children = convertObjToArrDeep(item.children, "folders");
        return item;
      });
    }
    case "chats":
      return arr;
    default:
      throw new Error(`Unkown array type: ${type}`);
  }
};

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const showDSContextMenu = (chatName) => {
  const el = getDSChatEl(chatName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();
};

export const simulateContextMenuAction = (btnClassName) => {
  const menu = getDSContextMenu();
  const btn = menu.querySelector(`.${btnClassName}`);
  btn.click();
};

export const getChatOrFolderInput = (type, id) =>
  document.querySelector(`.${type}-name__input[data-id='${id}']`);
