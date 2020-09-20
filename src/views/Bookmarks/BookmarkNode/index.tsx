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

  if (bm.url) {
    return (
      <Content>
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
        <Header level={level!} className="flex">
          <Title level={3}>{bm.title}</Title>
          <OptWrapper>
            <Button icon={<PlusOutlined />} onClick={() => onAdd(bm)} />
          </OptWrapper>
        </Header>
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
