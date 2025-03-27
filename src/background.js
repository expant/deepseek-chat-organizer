const urls = ["https://chat.deepseek.com/*"];
const apiPath = "/api/v0/chat_session";

const trackСhatDeletion = async (details) => {
  const { method, url } = details;
  const isDelete = method === "POST" && url.includes(`${apiPath}/delete`);
  if (!isDelete) return;

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (activeTab) {
    const args = [activeTab.id, { action: "chatDeleted" }];
    await chrome.tabs.sendMessage(...args);
    console.log("Сообщение отправлено:");
  }
};

chrome.webRequest.onCompleted.addListener(trackСhatDeletion, { urls });
