const container = document.querySelector(".container");
const notificationText = "Deepseek not detected! :(";

const renderMainContent = async () => {
  const statusEl = container.querySelector(".status");
  const btnToggle = container.querySelector(".btn-toggle");

  const updateUI = (isEnabled) => {
    const args = isEnabled ? ["off", "on"] : ["on", "off"];

    container.classList.replace(...args);
    statusEl.textContent = isEnabled ? "On" : "Off";
  };

  const switchMode = async () => {
    const isEnabled = container.classList.contains("on");

    try {
      await chrome.storage.local.set({ extensionEnabled: !isEnabled });

      updateUI(!isEnabled);

      chrome.runtime.sendMessage({ action: "toggle", state: !isEnabled });
    } catch (err) {
      console.error(err);
    }
  };

  const { extensionEnabled } = await chrome.storage.local.get([
    "extensionEnabled",
  ]);
  if (extensionEnabled) {
    updateUI(true);
  } else {
    updateUI(false);
  }

  btnToggle.addEventListener("click", switchMode);
};

const notifyUser = () => {
  container.classList.replace("off", "error");
  container.textContent = notificationText;
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await chrome.runtime.sendMessage({
      action: "checkCurrentTab",
    });

    if (response.isDeepseek) {
      renderMainContent();
      return;
    }
    notifyUser();
  } catch (err) {
    console.error("Ошибка при проверке вкладки:", err);
    container.textContent = "Error checking page";
  }
});
