import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarkElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  controlsElement.className = "bookmark-controls";

  newBookmarkElement.id = "bookmark-" + bookmark.time;

  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  setBookmarAttributes("play", onPlay, controlsElement);
  setBookmarAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);

  if (
    !Array.from(bookmarkElement.children).some(
      (el) => el.id == newBookmarkElement.id
    )
  ) {
    bookmarkElement.appendChild(newBookmarkElement);
  }
};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarkElement = document.getElementsByClassName("bookmarks")[0];
  bookmarkElement.innerHTML = ""; // Clear previous bookmarks

  if (currentBookmarks.length > 0) {
    currentBookmarks.forEach((bookmark) => {
      addNewBookmark(bookmarkElement, bookmark);
    });
  } else {
    bookmarkElement.innerHTML = `<i class="row">No bookmarks to show</i>`;
  }
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementDelete.remove();

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
};

const setBookmarAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = `<div class='title'>This is not a youtube video page.</div>`;
  }
});
