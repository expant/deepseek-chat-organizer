export const renameFolder = (items, id, name) =>
  items.map((item) => {
    if (typeof item === "string") return item;
    if (id !== item.id) {
      if (item.children)
        return { ...item, children: renameFolder(item.children, id, name) };
      return item;
    }
    if (item.name !== name && name) return { ...item, name };
    return item;
  });
