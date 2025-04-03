import {
  getQuestionByDomainName,
  toggleLink,
  updatePixelsByDomainName,
  updateResetClick,
} from "@/services/line";
import { useEffect, useRef, useState } from "react";

import {
  Space,
  Table,
  Tag,
  Switch,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Spin,
  ConfigProvider,
} from "antd";
import type { TableProps, FormProps } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  status: string;
  comment: number;
  lineName: string;
  link?: string;
  pixels?: string;
  clickNum?: number;
  tags?: string[];
}

export default function Home(props: any) {
  const { dataLines, domainName } = props;
  console.log(dataLines);

  // 号列表
  const [lists, setLists] = useState(dataLines.lines || []);
  // 编辑项
  const [changeLine, setChangeLine] = useState<any>({});

  // 切换上线/下线
  const [messageApi, contextHolder] = message.useMessage(); // 关键！
  const targge = async (checked: boolean, event: any) => {
    try {
      // 前端切换 上线/下线
      setLists((lists: any) => {
        const newLists = lists.map((item: any) => {
          if (item.lineName === event.lineName) {
            item.status = checked ? 1 : 0;
          }
          return item;
        });
        return newLists;
      });

      // 后端切换 上线/下线
      const data = {
        // _id: props.id,
        domainName, // 域名
        lineName: event.lineName, // 号
        status: checked ? 1 : 0, // 状态
      };
      const res = await toggleLink(data);
      // API调用成功后再显示消息
      messageApi.open({
        type: "success",
        content: "状态更新成功",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "更新失败，请重试",
      });
    }
  };

  // 修改信息
  const [open, setOpen] = useState(false);
  // 打开抽屉
  const showDrawer = (text: any) => {
    const { lineName, comment, pixels } = text;
    console.log(lineName, comment, pixels);
    setOpen(true);
    setChangeLine(text);
  };
  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 重置点击
  const resetClick = async (values: any) => {
    console.log(domainName, values);
    try {
      // 前端修改
      setLists((lists: any) => {
        const newLists = lists.map((item: any, index: number) => {
          // 重置指定号点击量
          if (index === values.key) {
            item.clickNum = 0;
          }
          return item;
        });
        return newLists;
      });
      // 后端修改
      const res: any = await updateResetClick({
        domainName,
        lineName: values.lineName,
      });
      console.log("Success:", values, res);
      messageApi.open({
        type: "success",
        content: res.message,
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "修改失败，请重试",
      });
    }
  };

  // table表单
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "状态",
      key: "status",
      render: (text) => {
        const check = text.status === 0 ? true : false;
        return (
          <Space direction="vertical">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={text.status == "0" ? false : true}
              onClick={() => targge(check, text)}
            />
          </Space>
        );
      },
    },
    {
      title: "备注",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "号",
      dataIndex: "lineName",
      key: "lineName",
    },
    {
      title: "链接",
      key: "link",
      dataIndex: "link",
    },
    {
      title: "像素",
      key: "pixels",
      dataIndex: "pixels",
    },
    {
      title: "点击",
      key: "clickNum",
      // dataIndex: "clickNum",
      render: (_, record) => {
        console.log("DDD", _);
        return (
          <Space size="middle">
            <Tag color="success">{_.clickNum}</Tag>
            <Button type="primary" size="small" onClick={() => resetClick(_)}>
              重置
            </Button>
          </Space>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showDrawer(_)}
            />
          </Space>
        );
      },
    },
  ];

  const data: DataType[] = lists.map((item: any, index: number) => {
    item.key = index;
    return item;
  });

  // form
  // Form.Item 可以通过 dependencies 属性，设置关联字段。
  // 当关联字段的值发生变化时，会触发校验与更新。
  const [form] = Form.useForm();

  type FieldType = {
    key: number;
    comment?: string;
    lineName?: string;
    pixels?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      // 前端修改
      setLists((lists: any) => {
        const newLists = lists.map((item: any, index: number) => {
          // 统一修改像素
          item.pixels = values.pixels;
          // 修改指定号信息
          if (index === values.key) {
            item.comment = values.comment;
            item.lineName = values.lineName;
          }
          return item;
        });
        return newLists;
      });
      // 后端修改
      const res = await updatePixelsByDomainName({ ...values, domainName });
      console.log("Success:", values, res);
      messageApi.open({
        type: "success",
        content: "修改成功",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "修改失败，请重试",
      });
    } finally {
      onClose();
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ margin: "30px 50px" }}>
      {/* 提示 */}
      {contextHolder} {/* 必须添加在组件最外层 */}
      <div>
        <h1
          style={{
            textAlign: "center",
            padding: "20px",
            background: "#fafafa",
            borderBottom: "1px solid #ccc",
          }}
        >
          {dataLines.nation} ({dataLines.userName}--{dataLines.domainName})
        </h1>
      </div>
      {/* 表单 */}
      <Table<DataType> columns={columns} dataSource={data} pagination={false} />
      {/* 抽屉 */}
      <Drawer title="修改" onClose={onClose} open={open}>
        <div style={{ marginBottom: "20px" }}>
          ID: <Tag>{dataLines._id}</Tag>
          状态：<Tag>{changeLine.status === 1 ? "上线" : "下线"}</Tag>
        </div>

        <Form
          key={changeLine.lineName || "form"} // 当lineName变化时重新创建Form
          name="basic"
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={changeLine}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType> label="索引值" name="key">
            <Input disabled style={{ width: "40px" }} />
          </Form.Item>

          <Form.Item<FieldType>
            label="备注"
            name="comment"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="号名"
            name="lineName"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="像素"
            name="pixels"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

// 请求

export async function getServerSideProps(context: any) {
  const { id = "" } = context.params;
  console.log("@@@", id);
  // 存储返回的后台数据
  let dataLines = null;
  try {
    // 发送请求：根据 id 获取问卷数据
    const res = await getQuestionByDomainName(id);
    dataLines = res.data[0];
  } catch (error) {
    console.error("获取数据失败", error);
    dataLines = { code: 1, msg: "数据获取失败" };
  }

  return {
    props: { dataLines, domainName: id },
  };
}
