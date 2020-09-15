import React, { useCallback, useEffect, useState } from "react";

import Bookmark from "../../services/bookmark";

const Bookmarks: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);
  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getTreeBookmarks();
    setTreeBookmarks(bookmarks as any[]);
  }, []);
  useEffect(() => {
    getTreeBookmarks();
  }, [getTreeBookmarks]);
  return <>hello world{JSON.stringify(bookmarks)}</>;
};

export default Bookmarks;
