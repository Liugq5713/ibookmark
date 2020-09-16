import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const BookmarkNode: React.FC<{
  level?: number;
  bm: BookmarkTreeNode;
  onAdd(parent: BookmarkTreeNode): void;
}> = ({ level, bm, onAdd }) => {
  if (bm.url) {
    return (
      <Content>
        <a href={bm.url}>{bm.title || bm.url}</a>
        <Opt
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onAdd(bm)}
        ></Opt>
      </Content>
    );
  }

  if (bm.title) {
    return (
      <>
        <Header level={level!} className="flex">
          <Title level={3}>{bm.title}</Title>
          <Opt
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onAdd(bm)}
          ></Opt>
        </Header>
        <Divider />
      </>
    );
  }
  return null;
};

export default BookmarkNode;

const Header = styled.div<{ level: number }>`
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
  margin-left: ${(props) => props.level * 16}px;
`;

const Content = styled.div`
  display: inline-block;
  width: 320px;
`;

const Opt = styled(Button)`
  visibility: hidden;
  ${Content}:hover & {
    visibility: visible;
  }
  ${Header}:hover & {
    visibility: visible;
  }
`;
