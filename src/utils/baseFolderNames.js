const baseName = "Untitled";

export const getNewBaseFolderName = (arr) => {
  if (arr.length === 0) return baseName;

  const nums = arr.map((item) => {
    const match = item.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });

  let missingNum = 0;
  while (nums.includes(missingNum)) {
    missingNum += 1;
  }
  return missingNum ? `${baseName} ${missingNum}` : baseName;
};

export const getBaseFolderNames = (items, acc) =>
  items.reduce((names, item) => {
    if (item.type === "chat") return names;

    const [text] = item.name.split(" ");
    if (text === baseName) {
      const newNames = [...names, item.name];
      return item.children
        ? getBaseFolderNames(item.children, newNames)
        : newNames;
    }
    return getBaseFolderNames(item.children, names);
  }, acc);

export const sortBaseNames = (a, b) => {
  if (a === baseName) return -1;
  if (b === baseName) return 1;

  const numA = parseInt(a.split(" ")[1] || 0);
  const numB = parseInt(b.split(" ")[1] || 0);
  return numA - numB;
};
