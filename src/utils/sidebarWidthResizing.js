import { classNames } from "@/variables";

const baseWidth = 260;
const variableName = "--local-sider-width";
const { SIDEBAR } = classNames;

export const setCurrentWidth = async () => {
  const sidebar = document.querySelector(`.${SIDEBAR}`);
  const { sidebarWidth } = await chrome.storage.sync.get(["sidebarWidth"]);
  sidebar.style.setProperty(variableName, sidebarWidth);
};

export const setNewWidth = async (scale) => {
  const sidebar = document.querySelector(`.${SIDEBAR}`);
  const newWidth = baseWidth * scale;
  sidebar.style.setProperty(variableName, `${newWidth}px`);
  await chrome.storage.sync.set({ sidebarWidth: `${newWidth}px` });
};
