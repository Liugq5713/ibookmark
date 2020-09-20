import { promisify } from "../utils";

class Bookmark {
  static getTreeBookmarks = promisify(chrome.bookmarks.getTree);

  static createBookmark(obj: chrome.bookmarks.BookmarkCreateArg) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.create(obj, (result) => {
        resolve(result);
      });
    });
  }

  static deleteBookmark(id: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.remove(id, (result: unknown) => {
        console.log(result);
        resolve(result);
      });
    });
  }
}

export default Bookmark;
