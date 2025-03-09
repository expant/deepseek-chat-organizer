import { SIDEBAR_CLASS_NAME } from "@/variables";

const variableName = "--local-sider-width";
let isResizing = false;

const resize = async (e, sidebar, width) => {
  if (!isResizing) return;
  const { min, max } = width;
  const newWidth = e.clientX - sidebar.getBoundingClientRect().left;

  if (newWidth > min && newWidth < max) {
    sidebar.style.setProperty(variableName, `${newWidth}px`);
    await chrome.storage.sync.set({ sidebarWidth: `${newWidth}px` });
  }
};

const stopResize = () => {
  isResizing = false;
  document.body.style.userSelect = "auto";
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};

export default async () => {
  const sidebar = document.querySelector(`.${SIDEBAR_CLASS_NAME}`);
  const sidebarStyles = window.getComputedStyle(sidebar);
  const { sidebarWidth } = await chrome.storage.sync.get(["sidebarWidth"]);
  console.log(sidebarWidth);

  const baseSidebarWidth = sidebarStyles.getPropertyValue(variableName).trim();
  const width = { min: parseInt(baseSidebarWidth, 10), max: 500 };
  let sidebarHandler = sidebar.querySelector(".sidebar-handle");
  // if (!sidebarWidth) {
  //   sidebar.style.setProperty(variableName, baseSidebarWidth);
  //   await chrome.storage.sync.set({ sidebarWidth: baseSidebarWidth });
  // }

  if (!sidebarHandler) {
    sidebarHandler = document.createElement("div");
    sidebarHandler.classList.add("sidebar-handle");
    sidebar.appendChild(sidebarHandler);
  }

  sidebarHandler.addEventListener("mousedown", () => {
    isResizing = true;
    document.body.style.userSelect = "none";

    document.addEventListener(
      "mousemove",
      async (e) => await resize(e, sidebar, width)
    );
    document.addEventListener("mouseup", stopResize);
  });
};
