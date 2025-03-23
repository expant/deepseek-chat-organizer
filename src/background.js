const urls = ["https://chat.deepseek.com/*"];
const deleteApiPath = "/api/v0/chat_session/delete";
const newChatApiPath = "/api/v0/chat_session/items";

const trackСhatDeletion = async (details) => {
  const isDelete = details.method === "POST" && details.url.includes(deleteApiPath);
  if (!isDelete) return;

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    await chrome.tabs.sendMessage(activeTab.id, { action: "chatDeleted" });
    console.log("Сообщение отправлено:");
    return;
  }
};

// const trackNewChat = async (details) => {
//   const isNewChat = details.method === "POST" && details.url.includes(newChatApiPath);
//   if (!isNewChat) return;

//   const requestBody = details.requestBody;

//   if (requestBody && requestBody.raw) {
//     // Получаем первый элемент массива raw данных
//     const rawData = requestBody.raw[0].bytes;
//     const uint8Array = new Uint8Array(rawData);
//     const decoder = new TextDecoder("utf-8");
//     const bodyString = JSON.parse(decoder.decode(uint8Array));
//     console.log("Тело запроса (raw):", bodyString);
//   }

//   // const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // if (activeTab) {
//   //   await chrome.tabs.sendMessage(activeTab.id, { action: "chatDeleted" });
//   //   console.log("Сообщение отправлено:");
//   //   return;
//   // }
// };

chrome.webRequest.onCompleted.addListener(trackСhatDeletion, { urls });
// chrome.webRequest.onCompleted.addListener(trackNewChat, { urls }, ["requestBody"]);