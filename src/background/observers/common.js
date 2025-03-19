import { renameDSChat } from "./renameChat";

const menuClassName = "ds-floating-position-wrapper";
const renameBtnClassName = "ds-dropdown-menu-option--none";
const deleteBtnClassName = "ds-dropdown-menu-option--error";

export let observationType = "";
export const setObservationType = (type) => (observationType = type);

const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (
      !mutation.addedNodes[0] &&
      !mutation.target.classList.contains(menuClassName)
    )
      return;

    console.log("mutation from common: ", mutation);

    const el1 = mutation.addedNodes[0];
    const el2 = mutation.target;
    const isMenuEl1 = el1.classList.contains(menuClassName);
    const menuEl = isMenuEl1 ? el1 : el2;
    const renameBtn = menuEl.querySelector(`.${renameBtnClassName}`);
    const deleteBtn = menuEl.querySelector(`.${deleteBtnClassName}`);

    if (observationType === "deleteFromFolder") {
      deleteBtn.click();
      setObservationType("deleteFromList");
    } else {
      renameBtn.click();
      renameDSChat();
    }

    // if (observationType === "renameFromList") {

    // }
    observer.disconnect();
  }
};

export const observer = new MutationObserver(callback);
