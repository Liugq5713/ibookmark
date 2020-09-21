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
  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      function cb(...results: any[]) {
        resolve(results.length === 1 ? results[0] : results);
      }
      args.push(cb);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      func.call(null, ...args);
    });
  };
};

export const scrollIntoView = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
};
