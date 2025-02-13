export const getNewUntitled = (arr) => {
  if (arr.length === 0) return "Untitled";

  const nums = arr.map((item) => {
    const match = item.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });

  let missingNum = 0;
  while (nums.includes(missingNum)) {
    missingNum += 1;
  }
  return missingNum ? `Untitled ${missingNum}` : "Untitled";
};

export const getBaseNames = (items, acc) =>
  items.reduce((names, item) => {
    if (item.type === "chat") return names;

    const [text] = item.name.split(" ");
    if (text === "Untitled") {
      const newNames = [...names, item.name];
      return item.children ? getBaseNames(item.children, newNames) : newNames;
    }
    return getBaseNames(item.children, names);
  }, acc);

export const sortBaseNames = (a, b) => {
  if (a === "Untitled") return -1;
  if (b === "Untitled") return 1;

  const numA = parseInt(a.split(" ")[1] || 0);
  const numB = parseInt(b.split(" ")[1] || 0);
  return numA - numB;
};

export const isNameNotUnique = (items, name) =>
  items.some((item) => {
    if (item.type === "chat") return false;
    if (item.name === name) return true;
    if (item.children) return isNameNotUnique(item.children, name);
  });
