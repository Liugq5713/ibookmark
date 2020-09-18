export const getFavicon = (path: string) => {
  const url = new URL(path);
  return `${url.origin}/favicon.ico`;
};

export const validImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onerror = img.onabort = () => {
      reject("error");
    };
    img.onload = () => {
      resolve(true);
    };
  });
};
