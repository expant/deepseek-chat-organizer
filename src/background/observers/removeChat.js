const menuClassname = "ds-floating-position-wrapper";
const deleteElClassName = ".ds-dropdown-menu-option--error";
const config = { childList: true, attributes: true };

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes.length === 0) return;

      const addedNode = mutation.addedNodes[0];

      if (addedNode.classList.contains(menuClassname)) {
        console.log("Added childNode: ", addedNode);
        const deleteEl = addedNode.querySelector(deleteElClassName);
        deleteEl.click();
      }
    }

    if (mutation.type === "attributes") {
      if (mutation.attributeName !== "style") return;
      console.log(mutation);
    }

    observer.disconnect();
  }
});

export default () => observer.observe(document.body, config);
