import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, Modal, Typography } from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import Bookmark from "../../services/bookmark";

const { Title } = Typography;

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
            <ContentWrapper level={level}>
              <BookmarkItem bm={bm} onAdd={onAdd}></BookmarkItem>
              {renderBookmarks(bm.children, level + 1)}
            </ContentWrapper>
          </>
        );
      } else {
        return <BookmarkItem bm={bm} level={level} onAdd={onAdd} />;
      }
    });
  };

  return (
    <>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        My Tailwind Button
      </button>
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

const Header = styled.div<{ level: number }>`
  color: hsla(0, 0%, 100%, 0.85);
  font-weight: 500;
  margin-left: ${(props) => props.level * 16}px;
`;

const Content = styled.div`
  display: inline-block;
  width: 320px;
`;

const ContentWrapper = styled.div<{ level: number }>`
  margin-left: ${(props) => props.level * 16}px;
  margin-bottom: 32px;
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
