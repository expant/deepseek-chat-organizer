// variables
export let observationType = "";
export const names = { prev: "", new: "" };

// methods
export const setObservationType = (type) => (observationType = type);
export const setNames = (prevName, newName) => {
  names.prev = prevName;
  names.new = newName;
};
