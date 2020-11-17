import React from "react";
import styled from "styled-components";

import { Divider, Card, message } from "antd";
import "./test.css";
import Bookmark from "../../../services/bookmark";

import Category from "./Category";
import Link from "./Link";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const BookmarkNode: React.FC<{
  level?: number;
  bm: BookmarkTreeNode;
  onAdd(parent: BookmarkTreeNode): void;
}> = ({ level, bm, onAdd }) => {
  const onDel = (id: string) => {
    Bookmark.deleteBookmark(id);
  };

  const onDragStart = (ev: any, bm: BookmarkTreeNode) => {
    var dt = ev.dataTransfer;
    dt.effectAllowed = "move";
    delete bm.children;
    dt.setData("movedBookmark", JSON.stringify(bm));
  };

  const onDrop = async (ev: any, bm: BookmarkTreeNode) => {
    ev.preventDefault();
    ev.target.style.border = "none";
    ev.dataTransfer.dropEffect = "move";
    const movedBookmark = JSON.parse(ev.dataTransfer.getData("movedBookmark"));
    try {
      await Bookmark.move(movedBookmark.id, {
        parentId: bm.id,
      });
    } catch (e) {
      message.error(e.message);
    }
  };

  const onDragEnter = (ev) => {
    ev.target.style.border = "1px dashed #fff";
  };

  const onDragLeave = (ev) => {
    ev.target.style.border = "none";
  };
  const onDragOver = (ev: any) => {
    ev.preventDefault();
  };

  //  具体的书签
  if (bm.url) {
    return (
      <Content draggable={true} onDragStart={(e) => onDragStart(e, bm)}>
        <CardWrapper
          hoverable={true}
          onClick={() => window.open(bm.url, "_blank")}
        >
          <Link bm={bm} onAdd={onAdd} onDel={onDel} />
        </CardWrapper>
      </Content>
    );
  }

  // 标签分类
  if (bm.title) {
    return (
      <>
        <div
          className="w-full"
          onDrop={(e) => onDrop(e, bm)}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
        >
          <Category bm={bm} level={level} onAdd={onAdd} />
        </div>
        <Divider style={{ margin: "8px 0" }} />
      </>
    );
  }
  return null;
};

export default BookmarkNode;

export const CardWrapper = styled(Card)`
  border-radius: 40px;
  .ant-card-body {
    padding: 8px !important;
  }
`;

const Content = styled.div`
  width: 320px;
`;
