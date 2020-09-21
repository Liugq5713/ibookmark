import React, { useState } from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import FAvatar from "../../../components/FAvatar";
import Bookmark from "../../../services/bookmark";

const { Title } = Typography;

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const BookmarkNode: React.FC<{
  level?: number;
  bm: BookmarkTreeNode;
  onAdd(parent: BookmarkTreeNode): void;
}> = ({ level, bm, onAdd }) => {
  const [isDrop, setIsDrop] = useState(false);
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
    ev.dataTransfer.dropEffect = "move";
    const movedBookmark = JSON.parse(ev.dataTransfer.getData("movedBookmark"));
    try {
      await Bookmark.move(movedBookmark.id, {
        parentId: bm.id,
      });
      setIsDrop(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const onDragEnter = () => {
    setIsDrop(true);
  };

  const onDragLeave = () => {
    setIsDrop(false);
  };
  const onDragOver = (ev: any) => {
    ev.preventDefault();
  };

  if (bm.url) {
    return (
      <Content draggable={true} onDragStart={(e) => onDragStart(e, bm)}>
        <CardWrapper hoverable={true}>
          <div className="flex items-center">
            <div>
              <FAvatar className="position" src={bm.url} />
            </div>
            <Text className="ml-4" title={bm.url} href={bm.url} target="_blank">
              {bm.title || bm.url}
            </Text>
          </div>
          <OptWrapper className="right-0">
            <Button icon={<PlusOutlined />} onClick={() => onAdd(bm)} />
            <Button icon={<DeleteOutlined />} onClick={() => onDel(bm.id)} />
          </OptWrapper>
        </CardWrapper>
      </Content>
    );
  }

  if (bm.title) {
    return (
      <>
        <DropItem
          className="w-full"
          isDrop={isDrop}
          onDrop={(e) => onDrop(e, bm)}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
        >
          <Header
            id={`${bm.title}_${bm.id}`}
            level={level!}
            className="flex w-full"
          >
            <Title className="w-full" level={3}>
              {bm.title}
            </Title>
            <OptWrapper className="left-0">
              <Button icon={<PlusOutlined />} onClick={() => onAdd(bm)} />
            </OptWrapper>
          </Header>
        </DropItem>
        <Divider style={{ margin: "8px 0" }} />
      </>
    );
  }
  return null;
};

export default BookmarkNode;

export const CardWrapper = styled(Card)`
  .ant-card-body {
    padding: 8px !important;
  }
`;

const Header = styled.div<{ level: number }>`
  width: 100%;
  margin-top: 32px;
  position: relative;
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
  margin-left: ${(props) => props.level * 16}px;
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

const DropItem = styled.div<{ isDrop: boolean }>`
  border: ${(props) => (props.isDrop ? "1px dashed #cbd5e0" : "none")};
`;

const OptWrapper = styled.div`
  display: none;
  position: absolute;
  ${Content}:hover & {
    display: block;
  }
  ${Header}:hover & {
    display: block;
  }
`;
