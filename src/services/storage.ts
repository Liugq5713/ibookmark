class Storage {
  static set = (str: string | string[]) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(str, () => {
        resolve(true);
      });
    });
  };
  static get = (str: string | string[]) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(str, (items) => {
        resolve(items);
      });
    });
  };
}

export default Storage;
