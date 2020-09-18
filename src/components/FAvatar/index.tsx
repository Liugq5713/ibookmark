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
      const isValid = await validImage(url);
      if (isValid) {
        setUrl(url);
      }
    }
  }, [src]);

  useEffect(() => {
    getUrl();
  }, [getUrl]);

  return url ? (
    <Avatar size={24} className="mr-4" src={getFavicon(url)} />
  ) : null;
};

export default FAvatar;
