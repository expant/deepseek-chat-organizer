const inputClassName = "ds-input__input";
const menuClassName = "ds-floating-position-wrapper";
const renameBtnClassName = "ds-dropdown-menu-option--none";

export let observationType = "";
export const names = { prev: "", new: "" };
export const setObservationType = (type) => (observationType = type);
export const setNames = (prevName, newName) => {
  names.prev = prevName;
  names.new = newName;
};

const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    renameDSChat(mutation);
  }
};

export const observer = new MutationObserver(callback);

export const renameDSChat = (mutation) => {
  if (
    !mutation.addedNodes[0] &&
    !mutation.target.classList.contains(menuClassName)
  )
    return;

  console.log("variant 4");

  const el1 = mutation.addedNodes[0];
  const el2 = mutation.target;
  const isMenuEl1 = el1.classList.contains(menuClassName);
  const menuEl = isMenuEl1 ? el1 : el2;
  const renameBtn = menuEl.querySelector(`.${renameBtnClassName}`);
  renameBtn.click();

  setTimeout(() => {
    const input = document.querySelector(
      `input.${inputClassName}[value="${names.prev}"]`
    );
    input.value = names.new;
    input.blur();
    console.log("variant 4.1");
  }, 100);
  observer.disconnect();
};
