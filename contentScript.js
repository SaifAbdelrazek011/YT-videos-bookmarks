(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type == "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }
  });

  const newVideoLoaded = () => {
    const bookmarkBtnExists =
      document.getElementsByClassName(".bookmark-btn")[0];

    console.log("Bookmark Button Exists: ", bookmarkBtnExists);
    if (bookmarkBtnExists) {
      const bookmarkBtn = document.getElementsByClassName(".bookmark-btn");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytb-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark this video";

      youtubeLeftControls =
        document.getElementsByClassName(".ytp-left-controls");
      youtubePlayer = document.getElementsByClassName(".video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  newVideoLoaded();

  const addNewBookmarkEventHandler = () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };
    console.log("New Bookmark: ", newBookmark);

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };
})();

console.log("Content script loaded");

const getTime = (time) => {
  const date = new Date(0);
  date.setSeconds(time); // specify value for SECONDS here

  return date.toISOString().substr(11, 8); // format: 00:00:00
};
