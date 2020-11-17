import React from "react";

import styled from "styled-components";

import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
const buttonSize = 48;
type Props = {
  bm: BookmarkTreeNode;
  level?: number;
  onAdd: any;
};
const Category: React.FC<Props> = ({ bm, level, onAdd }) => {
  const getTitleLevel = (level?: number): any => {
    if (level) {
      return level > 3 ? 5 : Number(level) + 1;
    } else {
      return 5;
    }
  };

  return (
    <>
      <Header id={`${bm.title}_${bm.id}`} className="flex w-full link-wrapper">
        <Title className="w-full link-title" level={getTitleLevel(level)}>
          <span className="link-wrapper__title">
            {bm.title} <Title level={8}> {bm?.children?.length} </Title>
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
    </>
  );
};

export default Category;

const Header = styled.div`
  width: 100%;
  margin-top: 32px;
  position: relative;
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
`;

const OptWrapper = styled.div.attrs({
  className: "right-0 top-0 bottom-0 absolute h-full m-auto",
})`
  display: none;
  ${Header}:hover & {
    display: block;
  }
`;
