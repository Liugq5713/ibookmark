class Bookmark {
  static getTreeBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((all) => {
        resolve(all);
      });
    });
  }
}

export default Bookmark;
