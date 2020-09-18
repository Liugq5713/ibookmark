import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card, Avatar } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getFavicon } from "../../../utils";

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
          <div className="flex">
            <Avatar className="mr-4" src={getFavicon(bm.url)} />
            <Text title={bm.url} href={bm.url}>
              {bm.title || bm.url}
            </Text>
          </div>
          <OptWrapper className="space-x-4">
            <Opt
              onClick={() => window.open(bm.url, "_blank")}
              icon={<EyeOutlined />}
            />
            <Opt icon={<PlusOutlined />} onClick={() => onAdd(bm)}></Opt>
            <Opt icon={<EditOutlined />} onClick={() => onAdd(bm)} />
            <Opt icon={<DeleteOutlined />} onClick={() => onAdd(bm)}></Opt>
          </OptWrapper>
        </Card>
      </Content>
    );
  }

  if (bm.title) {
    return (
      <>
        <Header level={level!} className="flex">
          <Title level={3}>{bm.title}</Title>
          <OptWrapper>
            <Opt icon={<PlusOutlined />} onClick={() => onAdd(bm)}></Opt>
          </OptWrapper>
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

const OptWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  margin: auto;
  bottom: 0;
`;

const Opt = styled(Button)`
  display: none;
  ${Content}:hover & {
    display: block;
  }
  ${Header}:hover & {
    display: block;
  }
`;
