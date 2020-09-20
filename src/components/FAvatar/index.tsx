import { Avatar } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getFavicon, validImage } from "../../utils";
import { SmileOutlined } from "@ant-design/icons";
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
    <Avatar {...restProps} src={getFavicon(url)} />
  ) : (
    <SmileOutlined style={{ width: 32, height: 32 }} {...restProps} />
  );
};

export default FAvatar;
