import { promisify } from "../utils";

class Storage {
  static set = promisify(chrome.storage.local.set);
  static get = promisify(chrome.storage.local.get);
}

export default Storage;
