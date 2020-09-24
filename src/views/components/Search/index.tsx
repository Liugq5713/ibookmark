import React, { useCallback, useState } from "react";

import { message, Select, Spin } from "antd";

import Bookmark from "../../../services/bookmark";

const { Option } = Select;

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Search: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const fetchBookmark = useCallback(async (str) => {
    try {
      setFetching(true);
      const bms = await Bookmark.search(str);
      setBookmarks((bms as BookmarkTreeNode[]).filter((bm) => bm.url));
    } catch (e) {
      message.error(e.message);
    } finally {
      setFetching(false);
    }
  }, []);

  const onOpen = (url) => {
    setCurrentUrl(url);
    window.open(url, "_blank");
  };

  return (
    <Select
      autoFocus
      mode="multiple"
      value={currentUrl}
      placeholder="Select users"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchBookmark}
      onChange={onOpen}
      style={{ width: "100%" }}
    >
      {bookmarks.map((bm) => (
        <Option key={bm.id} value={bm.url!}>
          {bm.title}
        </Option>
      ))}
    </Select>
  );
};

export default Search;
