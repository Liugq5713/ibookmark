// import { promisify } from "../utils";

class Storage {
  static set = (str: string | string[]) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(str, (items) => {
        console.log("===", items);
        resolve(items);
      });
    });
  };
  static get = (str: string | string[]) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(str, (items) => {
        console.log("===", items);
        resolve(items);
      });
    });
  };
}

export default Storage;
