import { inject } from "vue";

export function useContextMenuState() {
  const chatMenu = inject("chatMenu");
  const folderMenu = inject("folderMenu");

  const open = (type, id) => {
    if (type === "chat") {
      if (folderMenu.value.isOpen) {
        folderMenu.value = { ...folderMenu.value, isOpen: false };
      }
    } else {
      if (chatMenu.value.isOpen) {
        chatMenu.value = { ...chatMenu.value, isOpen: false };
      }
    }

    const currentMenu = type === "chat" ? chatMenu : folderMenu;
    if (currentMenu.value.isOpen) {
      currentMenu.value = { ...currentMenu.value, isOpen: false };
      return;
    }

    currentMenu.value = {
      ...currentMenu.value,
      isOpen: true,
      id,
    };
  };

  return { open };
}
