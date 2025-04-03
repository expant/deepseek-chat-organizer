import { ref } from "vue";

export function useStorage(key, defaultValue = null) {
  const data = ref(defaultValue);

  const load = async () => {
    const result = await chrome.storage.sync.get([key]);
    data.value = result[key] || defaultValue;
  };

  const update = async (newValue) => {
    await chrome.storage.sync.set({ [key]: newValue });
  };

  load();

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[key]) {
      data.value = changes[key].newValue;
    }
  });

  return { data, update };
}
