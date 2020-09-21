import React, { useCallback, useEffect, useState } from "react";

import { Button, Layout } from "antd";

import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
const { Header, Footer, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);

  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getTreeBookmarks();
    console.log({ bookmarks });

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
      <Layout>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
          }}
        >
          <Button type="primary" className="absolute top-0 right-0">
            {"v" + appInfo.version}
          </Button>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0 }}>Header</Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <Bookmarks bookmarks={bookmarks} />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            {"v" + appInfo.version}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
