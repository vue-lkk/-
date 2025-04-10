import {
  checkbyusername,
  addByNation,
  deleteByNation,
  createByNation,
} from "@/services/line";
import { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  DiffOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Modal,
  Row,
  Tag,
  Tooltip,
  Form,
  Input,
  Button,
  message,
  Result,
  Select,
  Switch,
  Flex,
} from "antd";
import type { TableProps, FormProps } from "antd";
const { Option } = Select;
import FButton from "@/components/FButton";

export default function Home(props: any) {
  const { data } = props.dataLines;
  console.log("模板后台:", data);
  const [templates, setTemplates] = useState([...data]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 编辑项
  const [changeLine, setChangeLine] = useState<any>({});
  // 操作类型
  const [type, setType] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 批量添加链接
  const add = async (item: any) => {
    setType("add");
    showModal();
    setChangeLine(item);

    // const data = await addByNation()
  };

  // 批量删除链接
  const del = async (item: any) => {
    setType("del");
    showModal();
    setChangeLine(item);
  };

  // 新建后台
  const create = async (item: any) => {
    setType("create");
    showModal();
    setChangeLine(item);
  };

  // form
  // Form.Item 可以通过 dependencies 属性，设置关联字段。
  // 当关联字段的值发生变化时，会触发校验与更新。
  const [form] = Form.useForm();

  type FieldType = {
    nation?: string; // 国家类型

    lineArr?: Array<any>; // 批量添加链接

    lineNameArr?: Array<any>; // 批量删除链接

    username?: Array<string> | string; // 用户名
    domainname?: string; // 域名
  };

  const users = [
    "周鹏鹏",
    "黄水海",
    "赖春霖",
    "彭宏",
    "邓春禹",
    "郑武康",
    "周前",
    "尹英奇",
    "张康建",
    "陈炫威",
    "钟贞兴",
    "方泽彬",
    "张天功",
    "曾强发",
    "林力梵",
    "韦恒平",
    "秦发龙",
    "邓文浩",
    "何鹏",
  ];

  const [custom, setCustom] = useState(false);
  const changeInput = (checked: boolean) => {
    setCustom(checked);
    console.log(checked);
  };

  const [messageApi, contextHolder] = message.useMessage(); // 关键！
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      // 批量添加
      if (type === "add") {
        // 1. 按行分割
        const lineArr = values.lineArr?.toString()?.split("\n");
        // 2. 处理每行
        const processedLines = lineArr
          ?.map((line) => line.trim()) // 去除每行首尾空格
          .filter((line) => line.length > 0); // 过滤空行
        values.lineArr = processedLines;
        const res: any = await addByNation(values as any);
        console.log("@3", res);
        messageApi.open({
          type: "success",
          content: res.message,
        });
      }

      // 批量删除
      if (type === "del") {
        // 1.以英文 ',' 或者中文 ‘，’ 分割数据
        const lineNameArr = values.lineNameArr?.toString()?.split(/[,，]\s*/);
        // 2. 处理每行
        const processedLines = lineNameArr
          ?.map((line) => line.trim()) // 去除每行首尾空格
          .filter((line) => line.length > 0); // 过滤空行
        values.lineNameArr = processedLines;
        const res = await deleteByNation(values as any);
        messageApi.open({
          type: "success",
          content: "批量删除成功",
        });
      }

      // 新建后台
      if (type === "create") {
        // 处理为字符串
        values.username = values.username?.toString(); // 安全访问
        const { nation, username, domainname } = values;
        const data = {
          nation,
          userName: username,
          domainName: domainname?.replace(/\s+/g, ""), // 去除所有空格
        };
        console.log("1213", data);
        const res: any = await createByNation(data as any);
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
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content:
          type === "add" ? "批量添加失败，请重试" : "批量删除失败，请重试",
      });
    } finally {
      handleCancel();
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        margin: "20px",
      }}
    >
      {/* 提示 */}
      {contextHolder} {/* 必须添加在组件最外层 */}
      <div>
        <Result
          style={{ padding: "20px" }}
          icon={<FileAddOutlined />}
          title="后台模板"
        />
        {/* 后台模板 */}
        <Flex wrap gap={60} justify="center">
          {Array.from(templates, (item, i) => (
            <Card
              key={item._id}
              hoverable
              actions={[
                <Tooltip
                  key={1}
                  placement="top"
                  title="批量添加链接"
                  color="blue"
                >
                  <PlusCircleOutlined key="add" onClick={() => add(item)} />
                </Tooltip>,
                <Tooltip
                  key={2}
                  placement="top"
                  title="批量删除链接"
                  color="red"
                >
                  <DeleteOutlined key="del" onClick={() => del(item)} />
                </Tooltip>,
                <Tooltip key={3} placement="top" title="新建后台" color="green">
                  <DiffOutlined key="create" onClick={() => create(item)} />
                </Tooltip>,
              ]}
              style={{
                minWidth: 340,
                background: "rgb(236 236 236)",
              }}
            >
              <Card.Meta
                title={item.nation}
                description={
                  <>
                    <p>
                      模板域名：<Tag>{item.domainName}</Tag>
                    </p>
                  </>
                }
              />
            </Card>
          ))}
        </Flex>

        {/* 对话框 */}
        <Modal
          title={changeLine.nation}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width="40%"
          footer={false}
        >
          <Form
            key={changeLine._id || form || type} // 当lineName变化时重新创建Form
            name="basic"
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={changeLine}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="广告类型"
              name="nation"
              rules={[{ required: true, message: "请输入广告类型:日本-减肥" }]}
            >
              <Input disabled={changeLine._id === "custom" ? false : true} />
            </Form.Item>

            {type === "add" && (
              <Form.Item<FieldType>
                label="批量添加"
                name="lineArr"
                rules={[{ required: true, message: "请输入添加的链接" }]}
              >
                <Input.TextArea
                  placeholder={`示例：'链接,备注,号名'
http://pf.kakao.com/_DCxfCn/chat,飞跃,@123
http://pf.kakao.com/_DCxfCn/chat11,312,@167
`}
                  autoSize={{ minRows: 8, maxRows: 100 }}
                />
              </Form.Item>
            )}

            {type === "del" && (
              <Form.Item<FieldType>
                label="批量删除"
                name="lineNameArr"
                rules={[{ required: true, message: "请输入删除的号" }]}
              >
                <Input.TextArea
                  placeholder={`示例：@123, @334`}
                  autoSize={{ minRows: 8, maxRows: 100 }}
                />
              </Form.Item>
            )}

            {type === "create" && (
              <div>
                <Form.Item label={null}>
                  <Switch
                    checkedChildren="开启自定义"
                    unCheckedChildren="关闭自定义"
                    onChange={changeInput}
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: "请输入用户名" }]}
                >
                  {custom ? (
                    <Input placeholder="请选择用户名" />
                  ) : (
                    <Select mode="multiple" placeholder="请选择用户名">
                      {users.map((user: string, index: number) => {
                        return (
                          <Option key={index} value={user}>
                            {user}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item<FieldType>
                  label="域 名"
                  name="domainname"
                  rules={[{ required: true, message: "请输入域名" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            )}

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
    </div>
  );
}

// 请求
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
  // 存储返回的后台数据
  let dataLines = null;
  try {
    // 发送请求：根据 id 获取问卷数据
    const res = await checkbyusername("lkk");
    dataLines = res;
    console.log("模板后台", res);
  } catch (error) {
    console.error("获取数据失败", error);
    dataLines = { code: 1, msg: "数据获取失败" };
  }

  return {
    props: { dataLines },
  };
}
