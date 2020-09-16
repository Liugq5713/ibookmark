import React, { ReactNode, useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { Button, Divider, Form, Input, message, Modal, Typography } from "antd";
import Bookmark from "../../services/bookmark";
import BookmarkNode from "./BookmarkNode";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

type Props = {
  bookmarks: BookmarkTreeNode[];
};

const Bookmarks: React.FC<Props> = ({ bookmarks }) => {
  const [visible, setVisible] = useState(false);
  const [parentNode, setParentNode] = useState<BookmarkTreeNode>();
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  const onCancel = () => {
    setVisible(false);
    setParentNode(undefined);
  };

  const onFinish = async (values: any) => {
    try {
      const res = await Bookmark.createBookmark({
        ...values,
        parentId: parentNode?.id,
      });
      console.log(res);
      message.success("增加成功");
      setVisible(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const onAdd = (bm: BookmarkTreeNode) => {
    setParentNode(bm);
    setVisible(true);
  };

  const renderBookmarks = (
    bookmarks: BookmarkTreeNode[],
    level: number
  ): ReactNode => {
    return bookmarks.map((bm) =>
      bm.children ? (
        <ContentWrapper level={level}>
          <BookmarkNode bm={bm} onAdd={onAdd}></BookmarkNode>
          {renderBookmarks(bm.children, level + 1)}
        </ContentWrapper>
      ) : (
        <BookmarkNode bm={bm} level={level} onAdd={onAdd} />
      )
    );
  };

  return (
    <>
      <Modal
        title={`${parentNode?.title} 添加子书签`}
        visible={visible}
        destroyOnClose={true}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form form={form} name="basic" onFinish={onFinish}>
          <Form.Item
            label="title"
            name="title"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="url"
            name="url"
            rules={[{ message: "Please input your url!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {renderBookmarks(bookmarks, 1)}
    </>
  );
};

export default Bookmarks;

const ContentWrapper = styled.div<{ level: number }>`
  margin-left: ${(props) => props.level * 16}px;
  margin-bottom: 32px;
`;
