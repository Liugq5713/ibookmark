import React from "react";
import styled from "styled-components";

import { Button } from "antd";
import FAvatar from "../../../components/FAvatar";

import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
const buttonSize = 48;

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
type Props = {
  bm: BookmarkTreeNode;
  onAdd: any;
  onDel: any;
};
const Link: React.FC<Props> = ({ bm, onAdd, onDel }) => {
  return (
    <Content>
      <div className="flex items-center">
        <div>
          <FAvatar className="position" src={bm?.url || ""} />
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
    </Content>
  );
};

export default Link;

const Text = styled.a`
  width: 100%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Content = styled.div``;

const OptWrapper = styled.div.attrs({
  className: "right-0 top-0 bottom-0 absolute h-full m-auto",
})`
  display: none;
  ${Content}:hover & {
    display: block;
  }
`;
