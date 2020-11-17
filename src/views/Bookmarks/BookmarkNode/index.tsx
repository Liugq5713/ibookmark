import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./test.css";
import FAvatar from "../../../components/FAvatar";
import Bookmark from "../../../services/bookmark";

const { Title } = Typography;

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

  const getTitleLevel = (level?: number): any => {
    if (level) {
      return level > 3 ? 5 : Number(level) + 1;
    } else {
      return 5;
    }
  };

  const buttonSize = 48;
  //  具体的书签
  if (bm.url) {
    return (
      <Content draggable={true} onDragStart={(e) => onDragStart(e, bm)}>
        <CardWrapper
          hoverable={true}
          onClick={() => window.open(bm.url, "_blank")}
        >
          <div className="flex items-center">
            <div>
              <FAvatar className="position" src={bm.url} />
            </div>
            <Text className="ml-4" title={bm.url}>
              {bm.title || bm.url}
            </Text>
          </div>
          <OptWrapper>
            <Button
              icon={<PlusOutlined />}
              size="large"
              style={{ width: buttonSize, height: buttonSize }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAdd(bm);
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              style={{ width: buttonSize, height: buttonSize }}
              size="large"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDel(bm.id);
              }}
            />
          </OptWrapper>
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
          <Header
            id={`${bm.title}_${bm.id}`}
            className="flex w-full link-wrapper"
          >
            <Title className="w-full link-title" level={getTitleLevel(level)}>
              <span className="link-wrapper__title">
                {bm.title} {bm?.children?.length}
              </span>
            </Title>
            <OptWrapper>
              <Button
                icon={<PlusOutlined />}
                style={{
                  width: buttonSize,
                  height: buttonSize,
                }}
                size="large"
                onClick={() => onAdd(bm)}
              />
            </OptWrapper>
          </Header>
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

const Header = styled.div`
  width: 100%;
  margin-top: 32px;
  position: relative;
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
`;

const Content = styled.div`
  width: 320px;
`;

const Text = styled.a`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptWrapper = styled.div.attrs({
  className: "right-0 top-0 bottom-0 absolute h-full m-auto",
})`
  display: none;
  ${Content}:hover & {
    display: block;
  }
  ${Header}:hover & {
    display: block;
  }
`;
