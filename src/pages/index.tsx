import { PoweroffOutlined } from "@ant-design/icons";
import { Card, Button, message, Result, Flex, Typography, Space } from "antd";
import { createTemplate, updateBanned } from "@/services/line";
import Link from "next/link";
// pages/index.tsx 或 app/page.tsx
import { useRouter } from "next/router"; // pages router

export default function Home(props: any) {
  // Pages Router 写法：
  const router = useRouter();
  const username = router.query.username; // 直接获取

  const temp = [
    {
      key: 0,
      nation: "日本-减肥",
      userName: "lkk",
      domainName: "jpjf.com",
    },
    {
      key: 1,
      nation: "韩国-减肥",
      userName: "lkk",
      domainName: "krjf.com",
    },
    {
      key: 2,
      nation: "日本-男科",
      userName: "lkk",
      domainName: "jpnk.com",
    },
    {
      key: 3,
      nation: "日本-丰胸",
      userName: "lkk",
      domainName: "jpfx.com",
    },
  ];

  // 创建模板;
  const create = async (item: any) => {
    try {
      const res: any = await createTemplate(item as any);
      console.log(res);
      if (res.code === 202) {
        messageApi.open({
          type: "warning",
          content: res.message,
        });
      }
      if (res.code === 201) {
        messageApi.open({
          type: "success",
          content: res.message,
        });
      }
    } catch (error) {}
  };

  // 封禁/解封
  const changeBanned = async (isBanned: boolean) => {
    console.log(isBanned);
    try {
      const res: any = await updateBanned({ banned: isBanned });
      console.log(res);
      messageApi.open({
        type: !isBanned ? "success" : "error",
        content: res.message,
      });
    } catch (error) {
      messageApi.open({
        type: "success",
        content: "服务器错误",
      });
    }
  };

  const cardStyle: React.CSSProperties = {
    width: 300,
    margin: "0 20px",
  };

  const [messageApi, contextHolder] = message.useMessage(); // 关键！

  return (
    <div
      style={{
        margin: "10px 0",
      }}
    >
      <div>
        {/* 提示 */}
        {contextHolder} {/* 必须添加在组件最外层 */}
        <Result icon={<PoweroffOutlined />} title="以下内置后台模板" />
        <Flex wrap gap="small" justify="center">
          {Array.from(temp, (_, i) => (
            <Card
              key={_.key}
              hoverable
              style={cardStyle}
              styles={{
                body: { padding: 0, overflow: "hidden" },
              }}
            >
              <Flex
                vertical
                align="center"
                justify="space-between"
                style={{ padding: 32 }}
              >
                <Typography.Title level={3}>{_.nation}</Typography.Title>
                <Typography.Title level={4}>{_.domainName}</Typography.Title>
                <Typography.Title level={5}>{_.userName}</Typography.Title>
                <Space>
                  <Button
                    type="primary"
                    target="_blank"
                    onClick={() => create(_)}
                  >
                    创建
                  </Button>
                  {username === "lkk" && (
                    <>
                      <Button
                        danger
                        target="_blank"
                        onClick={() => changeBanned(true)}
                      >
                        封禁
                      </Button>
                      <Button
                        target="_blank"
                        onClick={() => changeBanned(false)}
                      >
                        解封
                      </Button>
                    </>
                  )}
                </Space>
              </Flex>
            </Card>
          ))}
        </Flex>
      </div>
    </div>
  );
}
