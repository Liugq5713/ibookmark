import { PageHeader } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);

  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getTreeBookmarks();
    setTreeBookmarks(bookmarks as any[]);
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
      <PageHeader className="site-page-header" title={"v" + appInfo.version} />
      <Bookmarks bookmarks={bookmarks} />
    </>
  );
};

export default Home;
