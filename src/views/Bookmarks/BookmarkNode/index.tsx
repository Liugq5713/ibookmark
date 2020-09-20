import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card } from "antd";
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
    const movedBookmark = ev.dataTransfer.getData("movedBookmark");
    chrome.bookmarks.move(
      movedBookmark.id,
      {
        parentId: bm.id,
      },
      (res) => {
        console.log(res);
      }
    );
  };
  const onDragOver = (ev: any) => {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    // var data = ev.dataTransfer.getData("text/plain");
    // const res = ev.dataTransfer.getData("text");
    // console.log("===", res);
    // console.log("end b", e);
  };
  if (bm.url) {
    return (
      <Content draggable={true} onDragStart={(e) => onDragStart(e, bm)}>
        <CardWrapper hoverable={true}>
          <div className="flex items-center">
            <div>
              <FAvatar className="position" src={bm.url} />
            </div>
            <Text className="ml-4" title={bm.url} href={bm.url}>
              {bm.title || bm.url}
            </Text>
          </div>
          <OptWrapper>
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
        <div onDrop={(e) => onDrop(e, bm)} onDragOver={onDragOver}>
          <Header level={level!} className="flex">
            <Title level={3}>{bm.title}</Title>
            <OptWrapper>
              <Button icon={<PlusOutlined />} onClick={() => onAdd(bm)} />
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
  .ant-card-body {
    padding: 8px !important;
  }
`;

const Header = styled.div<{ level: number }>`
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

const OptWrapper = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  ${Content}:hover & {
    display: block;
  }
  ${Header}:hover & {
    display: block;
  }
`;
