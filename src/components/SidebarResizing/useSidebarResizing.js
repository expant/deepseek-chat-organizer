import { ref, onMounted, onUnmounted } from "vue";
import { isOutsideClick } from "@/utils/helpers";
import { setNewWidth } from "@/utils/sidebarWidthResizing";
import { classNames } from "@/constants";

let timeoutId = null;
const { CHAT_LIST } = classNames;

const getElementWidth = (element) => {
  element.style.display = "block";
  element.style.visibility = "hidden";

  const width = element.offsetWidth;
  element.style.display = "none";
  return width;
};

export function useSidebarResizing() {
  const scrollContainer = document.querySelector(`.${CHAT_LIST.BASE}`);

  const showMenu = ref(false);
  const menuPosition = ref({ left: "0px", top: "0px" });
  const notiPosition = ref({ left: "0px", top: "0px" });
  const scales = ref([
    { num: 1, isActive: true },
    { num: 1.25, isActive: false },
    { num: 1.5, isActive: false },
    { num: 1.75, isActive: false },
    { num: 2, isActive: false },
  ]);

  const setPositions = async () => {
    const container = document.querySelector(".sidebar-resizing");
    const notification = container.querySelector(".notification");
    const menu = container.querySelector(".sidebar-resizing__menu");
    const resizingEl = document.querySelector(".sidebar-resizing__icon");
    const { sidebarResizing } = await chrome.storage.sync.get([
      "sidebarResizing",
    ]);
    const notiWidth = getElementWidth(notification);
    const menuWidth = getElementWidth(menu);
  
    const elementRect = container.getBoundingClientRect();
    const parentRect = scrollContainer.getBoundingClientRect();
    const marginRight =
      parentRect.right - scrollContainer.scrollLeft - elementRect.right;
  
    const rect = resizingEl.getBoundingClientRect();
    const sidebarWidthInt = parseInt(sidebarResizing.width, 10);
    const menuPositionLeft =
      sidebarWidthInt - menuWidth - marginRight - rect.width / 2;
    const notiPositionLeft =
      sidebarWidthInt - marginRight - rect.width / 2 - notiWidth / 2;
  
    menuPosition.value = {
      left: `${menuPositionLeft}px`,
      top: `${rect.top + 30}px`,
    };
    notiPosition.value = {
      left: `${notiPositionLeft}px`,
      top: `${rect.top - 50}px`,
    };
  };

  const setActiveScale = async () => {
    const { sidebarResizing } = await chrome.storage.sync.get([
      "sidebarResizing",
    ]);
  
    scales.value = scales.value.map((item) => {
      if (item.num === sidebarResizing.scale) return { ...item, isActive: true };
      return { ...item, isActive: false };
    });
  };
  
  const onResizing = async (scale) => {
    showMenu.value = false;
  
    await setNewWidth(scale);
    await setPositions();
    await setActiveScale();
  };

  onMounted(() => {
    timeoutId = setTimeout(async () => {
      await setPositions();
      await setActiveScale();
    }, 500);
  
    document.addEventListener("click", (event) => {
      if (isOutsideClick(event, ".sidebar-resizing__menu")) return;
      showMenu.value = false;
    });
  
    scrollContainer.addEventListener("scroll", setPositions);
  });
  
  onUnmounted(() => {
    document.removeEventListener("click", isOutsideClick);
    scrollContainer.removeEventListener("scroll", setPositions);
    clearTimeout(timeoutId);
  });

  return {
    scales,
    showMenu,
    menuPosition,
    notiPosition,
    onResizing,
  }
}