import { PageHeader } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";
// import Storage from "../../services/storage";
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);
  chrome.storage.local.get("user_name", (res: any) => {
    console.log(res);
  });

  const getTreeBookmarks = useCallback(async () => {
    // if (res) {
    //   setTreeBookmarks((res.bookmarks as unknown) as any[]);
    // } else {
    const bookmarks = await Bookmark.getTreeBookmarks();
    setTreeBookmarks((bookmarks as unknown) as any[]);
    chrome.storage.local.set({ bookmarks });

    // await Storage.set({ bookmarks });
    // }
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
