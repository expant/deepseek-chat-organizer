const urls = ["https://chat.deepseek.com/*"];
const apiPath = "/api/v0/chat_session";

const sendMessage = async (message) => {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (activeTab) {
    await chrome.tabs.sendMessage(activeTab.id, message);
  }
};

const trackСhatDeletion = async (details) => {
  const { method, url } = details;
  const isDelete = method === "POST" && url.includes(`${apiPath}/delete`);

  if (!isDelete) return;

  await sendMessage({ action: "chatDeleted" });
};

const trackExtensionState = (request) => {
  const { action, state } = request;

  if (action === "toggle") {
    sendMessage({ action, state });
  }
};

const clearStorage = (details) => {
  if (details.reason === "uninstall") {
    chrome.storage.sync.clear();
  }
};

chrome.webRequest.onCompleted.addListener(trackСhatDeletion, { urls });
chrome.runtime.onMessage.addListener(trackExtensionState);
chrome.runtime.onInstalled.addListener(clearStorage);
