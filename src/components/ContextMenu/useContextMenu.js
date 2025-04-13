import { watch } from "vue";
import { classNames } from "@/constants.js";
import { isOutsideClick } from "@/utils/helpers";
import { useChats } from "@/composables/useChats";

export function useContextMenu(menus, props, showSearchChats, emit) {
  const { CHAT_LIST } = classNames;
  const scrollContainer = document.querySelector(`.${CHAT_LIST.BASE}`);

  const { onDeleteFromFolder } = useChats(menus.chat);

  const openChatSearch = () => {
    showSearchChats.value = true;
    menus.folder.value = { ...menus.folder.value, isOpen: false };
  };

  const getActiveContextMenuState = () =>
    props.type === "chat"
      ? menus.chat.value.isOpen
      : menus.folder.value.isOpen;

  const handleDocumentClick = (event) => {
    const selector = `${props.type === "chat" ? ".cm-chat" : ".cm-folder"}`;
    if (isOutsideClick(event, selector)) return;
    emit("close");
  };

  const closeMenuAndRemoveFromFolder = async () => {
    const id = menus.chat.value.chatId;
  
    menus.chat.value = { ...menus.chat.value, isOpen: false };
    await onDeleteFromFolder(id);
  };

  const setPositions = () => {
    const rect = props.targetEl.getBoundingClientRect();
    const position = {
      top: rect.top + rect.height,
      left: rect.right - rect.height,
    };
  
    if (props.type === "chat") {
      menus.chat.value = { ...menus.chat.value, position };
      return;
    }
    menus.folder.value = { ...menus.folder.value, position };
  };
  
  watch(getActiveContextMenuState, (isOpen) => {
    const id = props.targetEl?.dataset.id || null;
  
    const wrongEl =
      (props.type === "chat" && id !== menus.chat.value.chatId) ||
      (props.type === "folder" && id !== menus.folder.value.folderId);
  
    if (wrongEl) return;

    if (isOpen) {
      setPositions();
      scrollContainer.addEventListener("scroll", setPositions);
      document.addEventListener("click", handleDocumentClick);
      return;
    }
  
    scrollContainer.removeEventListener("scroll", setPositions);
    document.removeEventListener("click", handleDocumentClick);
  });

  return {
    openChatSearch,
    closeMenuAndRemoveFromFolder,
  }
}