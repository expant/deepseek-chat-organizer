import mitt from "mitt";

export let observationType = "";

export const emitter = mitt();
export const names = { prev: "", new: "" };

export const setObservationType = (type) => (observationType = type);
export const setNames = (prevName, newName) => {
  names.prev = prevName;
  names.new = newName;
};
