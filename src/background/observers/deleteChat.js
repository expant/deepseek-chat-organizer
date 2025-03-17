import { getData } from "@/storage";
import { deleteChat } from "@/background/background";
import { setObservationType, observationType } from "./common.js";

const menuClassname = "ds-floating-position-wrapper";
const deleteBtnClassName = "ds-dropdown-menu-option--error";

const getDSChatEl = (name) => {
  const elements = document.querySelectorAll(CHAT_EL_CLASS_NAME);
  const entries = Object.entries(elements);
  const [, el] = entries.find(([_, el]) => el.textContent === name);
  return el;
};

export const handleDeleteChat = ({ chatList, chatId, mutation }) => {
  if (observationType !== "deleteFromFolder") {
    setObservationType("deleteFromFolder");
    const { name: chatName } = chatList.find((chat) => chat.id === chatId);
    const el = getDSChatEl(chatName);
    const dotsEl = el.nextElementSibling;
    dotsEl.click();
    return;
  }

  if (
    !mutation.addedNodes[0] &&
    !mutation.target.classList.contains(menuClassname)
  )
    return;
  const el1 = mutation.addedNodes[0];
  const el2 = mutation.target;
  const isMenuEl1 = el1.classList.contains(menuClassname);
  const menuEl = isMenuEl1 ? el1 : el2;
  const deleteBtn = menuEl.querySelector(`.${deleteBtnClassName}`);
  deleteBtn.click();
};
