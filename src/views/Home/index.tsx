import React, { useCallback, useEffect, useState } from "react";

import { Button } from "antd";

import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);

  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getTreeBookmarks();
    setTreeBookmarks((bookmarks as unknown) as any[]);
  }, []);

  useEffect(() => {
    getTreeBookmarks();
  }, [getTreeBookmarks]);

  chrome.bookmarks.onMoved.addListener(getTreeBookmarks);
  chrome.bookmarks.onChanged.addListener(getTreeBookmarks);
  chrome.bookmarks.onRemoved.addListener(getTreeBookmarks);
  chrome.bookmarks.onCreated.addListener(getTreeBookmarks);

  return (
    <>
      <Button type="primary" className="absolute top-0 right-0">
        {"v" + appInfo.version}
      </Button>

      <Bookmarks bookmarks={bookmarks} />
    </>
  );
};

export default Home;
