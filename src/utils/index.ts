export const getFavicon = (path: string) => {
  const url = new URL(path);
  return `${url.origin}/favicon.ico`;
};

export const validImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onerror = img.onabort = () => {
      reject(false);
    };
    img.onload = () => {
      resolve(true);
    };
  });
};

// chrome 插件的风格不是 error first 的
export const promisify = (func: Function) => {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      function cb(...results: any[]) {
        resolve(results.length === 1 ? results[0] : results);
      }

      args.push(cb);
      func.call(this, ...args);
    });
  };
};
