import { PoweroffOutlined } from "@ant-design/icons";
import {
  Card,
  Button,
  message,
  Result,
  Flex,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  FloatButton,
} from "antd";
import { createTemplate, updateBanned, checkbyusername } from "@/services/line";
import type { FormProps } from "antd";

// pages/index.tsx 或 app/page.tsx
import { useRouter } from "next/router"; // pages router
import { useEffect, useState } from "react";

import FButton from "../components/FButton";

export default function Home(props: any) {
  // Pages Router 写法：
  const router = useRouter();
  const username = router.query.username; // 直接获取

  type Data = {
    key: string;
    nation: string;
    userName: string;
    domainName: string;
  };
  // 模板列表
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    getuserInfo();
  }, []);

  const getuserInfo = async () => {
    // 查询模板后台
    const res = await checkbyusername("lkk");
    setData((values) => {
      const newData = res.data.map((item: any) => {
        return {
          key: item._id,
          nation: item.nation,
          userName: item.userName,
          domainName: item.domainName,
        };
      });
      return [
        ...newData,
        {
          key: "custom",
          nation: "自定义",
          userName: "",
          domainName: "",
        },
      ];
    });
    console.log("模板后台:", res.data);
  };

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
    {
      key: 4,
      nation: "韩国-男科",
      userName: "lkk",
      domainName: "krnk.com",
    },
    {
      key: 5,
      nation: "韩国-丰胸",
      userName: "lkk",
      domainName: "krnk.com",
    },
  ];

  // 创建默认模板
  const create = async (item: any) => {
    try {
      const res: any = await createTemplate(item as any);
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
    } catch (error) {
      console.log(error);
    }
  };

  // 创建自定义创建模板;
  const custom = async (item: any) => {
    showModal();
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

  // -----------------------------------------
  // form
  // Form.Item 可以通过 dependencies 属性，设置关联字段。
  // 当关联字段的值发生变化时，会触发校验与更新。
  const [form] = Form.useForm();

  type FieldType = {
    nation?: string; // 国家类型
    userName?: string; // 用户名
    domainName?: string; // 域名
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      console.log("12@@@", values);
      try {
        const res: any = await createTemplate(values as any);
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

        setData((val: any) => {
          return [
            {
              key: values.domainName,
              domainName: values.domainName,
              nation: values.nation,
              userName: values.userName,
            },
            ...val,
          ];
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
    } finally {
      handleCancel();
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 跳转到新建后台
  const toTemplate = () => {
    router.push("/template");
  };

  // 跳转到删除后台
  const toDeletebackstage = () => {
    router.push("/deletebackstage");
  };

  // 跳转到查看后台
  const toBackstage = () => {
    // 带参数跳转
    router.push("/backstage/test.com");
  };

  // 跳转到首页
  const toHome = () => {
    // 带参数跳转
    router.push("/");
  };

  return (
    <div>
      <div>
        {/* 提示 */}
        {contextHolder} {/* 必须添加在组件最外层 */}
        <Result icon={<PoweroffOutlined />} title="以下内置后台模板" />
        <Flex wrap gap="large" justify="center">
          {Array.from(data, (_, i) => (
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
                  {_.key === "custom" ? (
                    <Button
                      type="primary"
                      target="_blank"
                      onClick={() => custom(_)}
                    >
                      创建模板
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      target="_blank"
                      onClick={() => create(_)}
                    >
                      创建
                    </Button>
                  )}

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

      {/* 对话框 */}
      <Modal
        title="自定义模板"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="40%"
        footer={false}
      >
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ userName: "lkk" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="广告类型"
            name="nation"
            rules={[{ required: true, message: "请输入广告类型" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="用户名"
            name="userName"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            label="域&nbsp;&nbsp;&nbsp;名"
            name="domainName"
            rules={[{ required: true, message: "请输入域名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 悬浮按钮 */}
      <FButton />
    </div>
  );
}
