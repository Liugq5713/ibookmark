import React from "react";
import styled from "styled-components";

import { Divider, Typography, Button, Card, Dropdown, Menu } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import FAvatar from "../../../components/FAvatar";

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
        <CardWrapper hoverable={true}>
          <div className="flex items-center">
            <FAvatar size={16} className="mr-4 position" src={bm.url} />
            <Text title={bm.url} href={bm.url}>
              {bm.title || bm.url}
            </Text>
          </div>
          <OptWrapper>
            <Dropdown.Button
              onClick={() => onAdd(bm)}
              overlay={
                <Menu>
                  <Menu.Item key="3" icon={<EditOutlined />}></Menu.Item>
                  <Menu.Item
                    key="4"
                    icon={<DeleteOutlined />}
                    onClick={() => onAdd(bm)}
                  ></Menu.Item>
                </Menu>
              }
            >
              <PlusOutlined />
            </Dropdown.Button>
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
        <Divider />
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
