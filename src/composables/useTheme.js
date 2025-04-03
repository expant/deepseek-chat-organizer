import { ref, onMounted, onUnmounted } from "vue";
import { emitter } from "@/content_scripts/dom/state";

export function useTheme() {
  const theme = ref("light");

  const initTheme = () => {
    const bodyClassList = document.body.classList;

    if (bodyClassList.contains("dark")) {
      theme.value = "dark";
    }
  };

  onMounted(() => {
    initTheme();
    emitter.on("updateTheme", (newValue) => {
      theme.value = newValue;
    });
  });

  onUnmounted(() => {
    emitter.off("updateTheme");
  });

  return { theme };
}
