type SrcArrType = {
  name: string;
  status: string;
  uid: string;
  url: string;
};

type PropsType = {
  itemLayout?: "horizontal" | "vertical";
  href?: string;
  title?: string;
  avatar?: string;
  description?: string;
  content?: string;

  srcArr?: SrcArrType[]; // 评论图片
  imgWidth?: number;
  imgHeight?: number;

  star?: number; //收藏数量
  like?: number; //喜欢数量
  message?: number; // 评论数量
};

import React, { FC } from "react";

import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Divider, List, Space } from "antd";

const LkkList: FC<PropsType> = ({
  itemLayout = "vertical",
  href,
  title,
  avatar,
  description,
  content,
  srcArr,
  imgWidth,
  imgHeight,
  star = 0,
  like = 0,
  message = 0,
}) => {
  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <div style={{ margin: "10px 0 " }}>
      <Space>
        {React.createElement(icon)}
        {text}
      </Space>
    </div>
  );

  return (
    <>
      <List
        itemLayout={itemLayout}
        size="large"
        dataSource={[{ href, title, avatar, description, content }]}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            style={{
              flexWrap: itemLayout === "horizontal" ? "wrap" : "nowrap",
            }}
            actions={[
              <IconText
                icon={StarOutlined}
                text={star.toString()}
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text={like.toString()}
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text={message.toString()}
                key="list-vertical-message"
              />,
            ]}
            extra={
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: itemLayout === "horizontal" ? "wrap" : "nowrap",
                }}
              >
                {srcArr?.map(({ url }, index) => (
                  <img
                    style={{ margin: "5px 0", border: "1px solid #ccc" }}
                    key={index}
                    width={imgWidth}
                    height={imgHeight}
                    alt="logo"
                    src={url}
                  />
                ))}
              </div>
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
      {/* 分割线 */}
      <Divider style={{ margin: "0" }} />
    </>
  );
};

export default LkkList;
