chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("youtube.com/watch")
  ) {
    const url = new URL(tab.url);
    const videoId = url.searchParams.get("v");

    if (videoId) {
      console.log("Sending Video ID:", videoId);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: videoId,
      });
    }
  }
});

console.log("Background script loaded");
