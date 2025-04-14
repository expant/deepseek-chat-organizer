import { ref, onMounted, computed } from "vue";
import { useStorage } from "@/composables/useStorage";
import { generateId, isOutsideClick } from "@/utils/helpers";
import { addChatsToFolder } from "@/utils/chatAndFolderLogic";

export function useSearchChats(emit) {
  const { data: folders, update: setFolders } = useStorage("folders", []);
  const { data: chats, update: setChats } = useStorage("chats", []);

  const selected = ref([]);
  const searchQuery = ref("");

  const removeEventListeners = () => {
    const searchChatsWrap = document.querySelector(".search-chats-wrap");
    searchChatsWrap.removeEventListener("click", isOutsideClick);
    window.removeEventListener("keydown", onKeydown);
    emit("close");
  };

  const onKeydown = (event) => {
    if (event.key !== "Escape") return;
    removeEventListeners();
  };

  const onSelected = async (event, folderId) => {
    event.stopPropagation();

    if (!isOutsideClick(event, ".search-chats")) {
      removeEventListeners();
    }

    const newFolderId = generateId();

    const filteredChats = chats.value.filter((chat) =>
      selected.value.includes(chat.id)
    );
    const args = [filteredChats, folders.value, folderId, newFolderId];

    const newFolders = addChatsToFolder(...args);
    const newChats = chats.value.map((chat) => {
      return selected.value.includes(chat.id) || chat.folderId === folderId
        ? { ...chat, folderId: newFolderId }
        : chat;
    });

    setChats(newChats);
    setFolders(newFolders);
  };

  const filteredChatsByQuery = computed(() => {
    if (!searchQuery.value) return chats.value;

    return chats.value.filter((chat) => {
      const chatName = chat.name.toLowerCase();
      const searchValue = searchQuery.value.toLowerCase();
      return chatName.includes(searchValue);
    });
  });

  onMounted(async () => {
    const searchChatsWrap = document.querySelector(".search-chats-wrap");
    const input = searchChatsWrap.querySelector("input[name='search-chats']");

    input.focus();

    searchChatsWrap.addEventListener("click", (event) => {
      if (isOutsideClick(event, ".search-chats")) return;
      removeEventListeners();
    });
    window.addEventListener("keydown", onKeydown);
  });

  return {
    selected,
    onSelected,
    searchQuery,
    filteredChatsByQuery,
  };
}
