import React, { useCallback, useState } from "react";

import { message, Select, Spin } from "antd";

import Bookmark from "../../../services/bookmark";

const { Option } = Select;

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Search: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
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
    window.open(url, "_blank");
  };

  return (
    <Select
      labelInValue
      value={"ddff"}
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
