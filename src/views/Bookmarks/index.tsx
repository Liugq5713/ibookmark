import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal } from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import Bookmark from "../../services/bookmark";

type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;

const Bookmarks: React.FC = () => {
  const [bookmarks, setTreeBookmarks] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [parentNode, setParentNode] = useState<BookmarkTreeNode>();
  const [form] = Form.useForm();
  const getTreeBookmarks = useCallback(async () => {
    const bookmarks = await Bookmark.getTreeBookmarks();
    setTreeBookmarks(bookmarks as any[]);
  }, []);
  useEffect(() => {
    getTreeBookmarks();
  }, [getTreeBookmarks]);

  console.log(bookmarks);

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
    return bookmarks.map((bm) => {
      if (bm.children) {
        return (
          <>
            <BookmarkItem bm={bm} level={level} onAdd={onAdd} />
            {renderBookmarks(bm.children, level + 1)}
          </>
        );
      } else {
        return <BookmarkItem bm={bm} level={level} onAdd={onAdd} />;
      }
    });
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

const BookmarkItem: React.FC<{
  level: number;
  bm: BookmarkTreeNode;
  onAdd(parent: BookmarkTreeNode): void;
}> = ({ level, bm, onAdd }) => {
  if (bm.url) {
    return (
      <Content level={level}>
        <a href={bm.url}>{bm.title || bm.url}</a>
        <Opt
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onAdd(bm)}
        ></Opt>
      </Content>
    );
  } else {
    return (
      <>
        <Title>{bm.title || bm.url}</Title>
        <Divider />
      </>
    );
  }
};

const Title = styled.h2``;

const Content = styled.div<{ level: number }>`
  margin-left: ${(props) => props.level * 16}px;
  padding-left: ${(props) => props.level * 16}px;
`;

const Opt = styled(Button)`
  visibility: hidden;
  ${Content}:hover & {
    visibility: visible;
  }
  ${Title}:hover & {
    visibility: visible;
  }
`;
