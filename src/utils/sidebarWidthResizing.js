import { SIDEBAR_CLASS_NAME } from "@/variables";

const variableName = "--local-sider-width";
let isResizing = false;

const resize = (event, sidebar, sidebarChild, width) => {
  if (!isResizing) return;

  const { min, max } = width;
  const newWidth = event.clientX - sidebar.getBoundingClientRect().left;

  if (newWidth > min && newWidth < max) {
    sidebar.style.width = `${newWidth}px`;
    sidebarChild.style.width = `${newWidth}px`;
    sidebar.style.maxWidth = `${newWidth}px`;
    sidebarChild.style.maxWidth = `${newWidth}px`;
    // document.documentElement.style.setProperty(variableName, `${newWidth}px`);
  }
};

const stopResize = () => {
  isResizing = false;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};

export default () => {
  const sidebar = document.querySelector(`.${SIDEBAR_CLASS_NAME}`);
  const sidebarChild = sidebar.querySelector(".a2f3d50e");

  const sidebarStyles = window.getComputedStyle(sidebar);
  const rootStyles = getComputedStyle(document.documentElement);
  const sidebarWidth = rootStyles.getPropertyValue(variableName).trim();
  const width = { min: parseInt(sidebarWidth, 10), max: 500 };
  let sidebarHandle = sidebar.querySelector(".sidebar-handle");

  if (!sidebarHandle) {
    sidebarHandle = document.createElement("div");
    sidebarHandle.classList.add("sidebar-handle");
    sidebar.appendChild(sidebarHandle);
  }

  sidebarHandle.addEventListener("mousedown", () => {
    isResizing = true;
    document.addEventListener("mousemove", (e) =>
      resize(e, sidebar, sidebarChild, width)
    );
    document.addEventListener("mouseup", stopResize);
  });
};
