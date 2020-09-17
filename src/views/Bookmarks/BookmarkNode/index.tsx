import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card } from "antd";
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
        <Card hoverable={true}>
          <Text title={bm.url} href={bm.url}>
            {bm.title || bm.url}
          </Text>
          <Opt
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onAdd(bm)}
          ></Opt>
        </Card>
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
  position: relative;
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
  margin-left: ${(props) => props.level * 16}px;
`;

const Content = styled.div`
  display: inline-block;
  width: 320px;
`;

const Text = styled.a`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Opt = styled(Button)`
  display: none;
  position: absolute;
  top: 0;
  margin: auto;
  bottom: 0;
  ${Content}:hover & {
    display: block;
  }
  ${Header}:hover & {
    display: block;
  }
`;
