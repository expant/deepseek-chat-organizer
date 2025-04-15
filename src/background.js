const urls = ["https://chat.deepseek.com/*"];
const apiPath = "/api/v0/chat_session";

const isApiOperation = (method, url, operation) => {
  const endpoints = {
    delete: `${apiPath}/delete`,
  };
  return method === "POST" && url.includes(endpoints[operation]);
};

const getActiveTargetTab = async () => {
  const [url] = urls;
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url,
  });
  return tab;
};

const sendMessage = async (message) => {
  const tab = await getActiveTargetTab();

  if (tab) {
    await chrome.tabs.sendMessage(tab.id, message);
  }
};

const trackChatActions = async (details) => {
  const { method, url } = details;
  const isDelete = isApiOperation(method, url, "delete");

  if (isDelete) {
    await sendMessage({ action: "chatDeleted" });
  }
};

const trackExtensionState = (request, sender, sendResponse) => {
  const { action, state } = request;

  if (action === "toggle") {
    sendMessage({ action, state });
  }

  if (action === "checkCurrentTab") {
    (async () => {
      const tab = await getActiveTargetTab();
      const isDeepseek = !!tab;
      sendResponse({ isDeepseek });
    })();

    return true;
  }
};

const clearStorage = (details) => {
  if (details.reason === "uninstall") {
    chrome.storage.sync.clear();
  }
};

chrome.webRequest.onCompleted.addListener(trackChatActions, { urls });

chrome.runtime.onInstalled.addListener(clearStorage);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
  trackExtensionState(request, sender, sendResponse)
);
