import { PageHeader } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { Affix, Button } from "antd";

import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";
import Storage from "../../services/storage";
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);

  const getTreeBookmarks = useCallback(async () => {
    // if (res) {
    //   setTreeBookmarks((res.bookmarks as unknown) as any[]);
    // } else {

    const res: any = await Storage.get("bookmarks");
    if (res.bookmarks) {
      setTreeBookmarks((res.bookmarks as unknown) as any[]);
    } else {
      const bookmarks = await Bookmark.getTreeBookmarks();
      setTreeBookmarks((res.bookmarks as unknown) as any[]);
      await chrome.storage.local.set({ bookmarks });
    }

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
      <Button type="primary" className="absolute top-0 right-0">
        {"v" + appInfo.version}
      </Button>

      <Bookmarks bookmarks={bookmarks} />
    </>
  );
};

export default Home;
