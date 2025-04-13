import { classNames } from "@/constants";

const baseWidth = 260;
const variableName = "--local-sider-width";
const { SIDEBAR } = classNames;

export const setCurrentWidth = async () => {
  const sidebar = document.querySelector(`.${SIDEBAR.BASE}`);
  const { sidebarResizing } = await chrome.storage.sync.get([
    "sidebarResizing",
  ]);
  if (sidebarResizing) {
    sidebar.style.setProperty(variableName, sidebarResizing.width);
    return;
  }

  const newSidebarResizing = { width: `${baseWidth}px`, scale: 1 };
  await chrome.storage.sync.set({ sidebarResizing: newSidebarResizing });
};

export const setNewWidth = async (scale) => {
  const sidebar = document.querySelector(`.${SIDEBAR.BASE}`);
  const newWidth = baseWidth * scale;
  sidebar.style.setProperty(variableName, `${newWidth}px`);
  const sidebarResizing = { width: `${newWidth}px`, scale };
  await chrome.storage.sync.set({ sidebarResizing });
};
