import { ref } from "vue";
import _ from "lodash";

export function useStorage(key, defaultValue = null) {
  const data = ref(defaultValue);

  const load = async () => {
    const result = await chrome.storage.sync.get([key]);
    data.value = result[key] || defaultValue;
  };

  const update = async (newValue) => {
    data.value = _.cloneDeep(newValue);
    await chrome.storage.sync.set({ [key]: newValue });
  };

  load();

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[key]) {
      data.value = _.cloneDeep(changes[key].newValue);
    }
  });

  return { data, update };
}
