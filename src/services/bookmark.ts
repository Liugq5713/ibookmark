class Bookmark {
  static getTreeBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((all) => {
        resolve(all);
      });
    });
  }

  static createBookmark(obj: chrome.bookmarks.BookmarkCreateArg) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.create(obj, (result) => {
        resolve(result);
      });
    });
  }
}

export default Bookmark;
