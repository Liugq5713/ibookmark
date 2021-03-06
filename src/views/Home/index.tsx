import React, { ReactNode, useCallback, useEffect, useState } from "react";

import { Card, Divider, Layout, Menu, message } from "antd";

import TabIcon from "../../assets/tab_48.png";
import Bookmark from "../../services/bookmark";
import appInfo from "../../../package.json";
import Bookmarks from "../Bookmarks";
import { scrollIntoView } from "../../utils";

import Search from "../components/Search";
import styled from "styled-components";
import { relative } from "path";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const Home: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [sideItems, setSides] = useState<any[]>([]);

  const [total, setTotal] = useState(0);

  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = (await Bookmark.getSubTree("1")) as BookmarkTreeNode[];
    console.log(bookmarks);
    if (bookmarks.length > 1) {
      setTreeBookmarks(bookmarks);
    } else {
      setTreeBookmarks(bookmarks[0]?.children || bookmarks);
    }
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

  const getTotal = (bookmarks: BookmarkTreeNode[]): number => {
    let cnt = 0;
    function step(bookmarks: BookmarkTreeNode[]) {
      bookmarks.map((bm) => {
        if (bm.children) {
          return step(bm.children);
        } else {
          if (bm.url) {
            cnt++;
          }
        }
      });
    }
    step(bookmarks);
    return cnt;
  };

  useEffect(() => {
    setTotal(getTotal(bookmarks));
  }, [bookmarks]);
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
  chrome.bookmarks.onCreated.addListener(getSides);

  const onDrop = async (ev: any, side) => {
    ev.preventDefault();
    ev.target.style.border = "none";
    ev.dataTransfer.dropEffect = "move";
    const movedBookmark = JSON.parse(ev.dataTransfer.getData("movedBookmark"));
    try {
      await Bookmark.move(movedBookmark.id, {
        parentId: side.id,
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const onDragOver = (ev: any) => {
    ev.preventDefault();
  };
  const onDragEnter = (ev) => {
    ev.target.style.border = "1px dashed #fff";
  };

  const onDragLeave = (ev) => {
    ev.target.style.border = "none";
  };

  const renderMenu = (sideItems): ReactNode => {
    return sideItems.map((side) => {
      if (side.children && side.children.length > 0) {
        return (
          <SubMenu key={side.id} title={side.title}>
            {renderMenu(side.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={side.id}
            onDrop={(e) => onDrop(e, side)}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onClick={() => scrollIntoView(`${side.title}_${side.id}`)}
          >
            {side.title}
          </Menu.Item>
        );
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
          <div className="flex items-center p-4">
            <img src={TabIcon} width={32} alt="图片" />
            <div className="text-white pl-4">
              <div>版本： {"v" + appInfo.version}</div>
              <div>链接： {total} 条</div>
            </div>
          </div>
          <Divider className="my-2" />
          <Menu theme="dark" mode="inline">
            {renderMenu(sideItems)}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
              position: "relative",
            }}
          >
            <Search />
            <Bookmarks bookmarks={bookmarks} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;

// const BG = styled.div.attrs({
//   className: "inset-0",
// })`
//   background-image: url(${bg});
//   background-attachment: fixed;
//   background-repeat: no-repeat;
//   background-size: contain;
//   position: absolute;
//   filter: blur(4px);
// `;
