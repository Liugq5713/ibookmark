import { Avatar } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getFavicon, validImage } from "../../utils";
type Props = {
  src: string;
  [idx: string]: any;
};

const FAvatar: React.FC<Props> = ({ src, ...restProps }) => {
  const [url, setUrl] = useState("");

  const getUrl = useCallback(async () => {
    if (src) {
      const url = getFavicon(src);
      try {
        const isValid = await validImage(url);
        if (isValid) {
          setUrl(url);
        }
      } catch (e) {}
    }
  }, [src]);

  useEffect(() => {
    getUrl();
  }, [getUrl]);

  return url ? (
    <Avatar {...restProps} src={getFavicon(url)} />
  ) : (
    <Avatar {...restProps}>L</Avatar>
  );
};

export default FAvatar;
