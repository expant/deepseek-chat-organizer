import { getData } from "@/storage";
import { deleteChat } from "@/background/background";
import { getDSChatEl } from "@/utils/helpers.js";
import { setObservationType, observationType, observer } from "./common.js";

const openMenu = () => {
  const el = getDSChatEl(chatName);
  const dotsEl = el.nextElementSibling;
  dotsEl.click();
};

export const handleDeleteChat = (chatName) => {
  if (observationType === "deleteFromFolder") {
    observer.observe(document.body, { childList: true });
    openMenu(chatName);
    return;
  }

  if (observationType === "deleteFromList") {
  }
};
