import React, { useCallback, useState } from "react";

import { Select, Spin } from "antd";

import Bookmark from "../../../services/bookmark";

const { Option } = Select;

const Search: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const fetchBookmark = useCallback(async () => {
    const res = await Bookmark.search();
    console.log(res);
  }, []);
  const fetching = false;
  console.log(setBookmarks);
  return (
    <Select
      mode="multiple"
      labelInValue
      value={"ddff"}
      placeholder="Select users"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchBookmark}
      onChange={fetchBookmark}
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
