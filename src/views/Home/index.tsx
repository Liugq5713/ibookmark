import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Button, Layout, Menu } from "antd";

import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);
  const [sideItems, setSides] = useState<any[]>([]);

  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getSubTree("1");
    console.log({ bookmarks });

    setTreeBookmarks((bookmarks as unknown) as any[]);
  }, []);

  const getSides = async () => {
    const sides = (await Bookmark.getChildren("1")) as BookmarkTreeNode[];
    console.log({ sides });
    const sidesWithTitle = sides.filter((s) => !s.url);
    const res = await Promise.all(
      sidesWithTitle.map(async (s) => {
        return {
          ...s,
          children: (await Bookmark.getChildren(s.id)) as BookmarkTreeNode[],
        };
      })
    );

    console.log(res);

    setSides(
      res.map((s) => {
        return {
          title: s.title,
          id: s.id,
          children: s.children.filter((s) => !s.url),
        };
      })
    );
  };
  useEffect(() => {
    getSides();
  }, []);
  useEffect(() => {
    getTreeBookmarks();
  }, [getTreeBookmarks]);

  chrome.bookmarks.onMoved.addListener(getTreeBookmarks);
  chrome.bookmarks.onChanged.addListener(getTreeBookmarks);
  chrome.bookmarks.onRemoved.addListener(getTreeBookmarks);
  chrome.bookmarks.onCreated.addListener(getTreeBookmarks);

  const renderMenu = (sideItems): ReactNode => {
    return sideItems.map((side) => {
      if (side.children && side.children.length > 0) {
        return (
          <SubMenu key={side.id} title={side.title}>
            {renderMenu(side.children)}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={side.id}>{side.title}</Menu.Item>;
      }
    });
  };

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
          <Menu theme="dark" mode="inline">
            {renderMenu(sideItems)}
          </Menu>
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
