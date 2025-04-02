chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    console.log("URL Parameters: ", urlParameters);

    chrome.idle.onStateChanged.addListener((browserActivityState) => {
      console.log("browserActivityState changed");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url.match("https://.*.youtube.com/watch/.*'")) {
          chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"),
          });
        }
      });
    });
  }
});
