export async function getActiveTabURL() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  if (typeof tab === "undefined") {
    console.error("No active tab found.");
    return null;
  }
  return tab;
}
