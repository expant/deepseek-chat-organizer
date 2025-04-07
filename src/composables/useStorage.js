import _ from "lodash";
import { ref } from "vue";
import { convertObjToArrDeep } from "@/utils/helpers";

export function useStorage(key, defaultValue = []) {
  const data = ref(defaultValue);
  const isLoaded = ref(false);

  const load = async () => {
    const result = await chrome.storage.sync.get([key]);
    data.value = convertObjToArrDeep(result[key], key) || defaultValue;
    isLoaded.value = true;
  };

  const update = async (newValue) => {
    const value = convertObjToArrDeep(newValue, key);
    data.value = value;
    await chrome.storage.sync.set({ [key]: value });
  };

  load();

  chrome.storage.onChanged.addListener((changes) => {
    if (changes[key]) {
      data.value = _.cloneDeep(changes[key].newValue);
    }
  });

  return { data, update, isLoaded };
}
