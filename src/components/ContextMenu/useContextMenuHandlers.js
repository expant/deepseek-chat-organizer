import { watch, inject } from "vue";
import { classNames } from "@/constants.js";
import { isOutsideClick } from "@/utils/helpers";
import { useChats } from "@/composables/useChats";

export function useContextMenuHandlers(props, emit) {
  const chatMenu = inject("chatMenu");
  const folderMenu = inject("folderMenu");
  const showSearchChats = inject("showSearchChats");

  const { CHAT_LIST } = classNames;
  const scrollContainer = document.querySelector(`.${CHAT_LIST.BASE}`);

  const { onDeleteFromFolder } = useChats();

  const getActiveContextMenuState = () =>
    props.type === "chat" ? chatMenu.value.isOpen : folderMenu.value.isOpen;

  const handleDocumentClick = (event) => {
    const selector = `${props.type === "chat" ? ".cm-chat" : ".cm-folder"}`;
    if (isOutsideClick(event, selector)) return;
    emit("close");
  };

  const handleAddChats = () => {
    showSearchChats.value = true;
    folderMenu.value = { ...folderMenu.value, isOpen: false };
  };

  const closeMenuAndRemoveFromFolder = async () => {
    const id = chatMenu.value.id;

    chatMenu.value = { ...chatMenu.value, isOpen: false };
    await onDeleteFromFolder(id);
  };

  const setPositions = () => {
    const rect = props.targetEl.getBoundingClientRect();
    const position = {
      top: rect.top + rect.height,
      left: rect.right - rect.height,
    };

    if (props.type === "chat") {
      chatMenu.value = { ...chatMenu.value, position };
      return;
    }
    folderMenu.value = { ...folderMenu.value, position };
  };

  watch(getActiveContextMenuState, (isOpen) => {
    const id = props.targetEl?.dataset.id || null;

    const wrongEl =
      (props.type === "chat" && id !== chatMenu.value.id) ||
      (props.type === "folder" && id !== folderMenu.value.id);

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
    handleAddChats,
    closeMenuAndRemoveFromFolder,
  };
}
