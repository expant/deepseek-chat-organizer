const urls = ["https://chat.deepseek.com/*"];
const apiPath = "/api/v0/chat_session";
// const deleteApiPath = "/api/v0/chat_session/delete";
// const newChatApiPath = "/api/v0/chat_session/items";

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

// const trackNewChat = async (details) => {
//   const { method, url, requestBody } = details;
//   const isNewChat = method === "POST" && url.includes(newChatApiPath);

//   if (!isNewChat) return;

//   // if (requestBody && requestBody.raw) {
//   //   // Получаем первый элемент массива raw данных
//   //   const rawData = requestBody.raw[0].bytes;
//   //   const uint8Array = new Uint8Array(rawData);
//   //   const decoder = new TextDecoder("utf-8");
//   //   const bodyString = JSON.parse(decoder.decode(uint8Array));
//   //   console.log("Тело запроса (raw):", bodyString);
//   // }

//   // const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // if (activeTab) {
//   //   await chrome.tabs.sendMessage(activeTab.id, { action: "chatDeleted" });
//   //   console.log("Сообщение отправлено:");
//   //   return;
//   // }
// };

chrome.webRequest.onCompleted.addListener(trackСhatDeletion, { urls });
// chrome.webRequest.onCompleted.addListener(trackNewChat, { urls }, ["requestBody"]);
