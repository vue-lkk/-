import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  Checkbox,
  Divider,
  Modal,
  Tag,
  message,
  Result,
} from "antd";
import type { FormProps, CheckboxProps } from "antd";
import { useEffect, useState } from "react";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

import {
  getQuestionByuserName,
  checkbyusernameAndNation,
  deletebydomainNameArr,
} from "@/services/line";
import { DeleteFilled, FileExcelOutlined } from "@ant-design/icons";
import FButton from "@/components/FButton";

export default function DeleteBackstage(props: any) {
  const { data } = props.dataLines;
  const [templates, setTemplates] = useState([]);
  // 删除域名列表
  const [deleteList, setDeleteList] = useState([]);
  type FormDataType = {
    nation?: string[];
    userName?: string[];
  };
  const [formData, setFormData] = useState<FormDataType>({});

  useEffect(() => {
    setTemplates(() => {
      return data.map((item: any) => item.nation);
    });
  }, []);

  type FieldType = {
    nation?: string; // 国家类型
    userName?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log(values);
    if (values) {
      setFormData(values as FormDataType);
    }

    try {
      // 查询用户所有的后台
      const res: any = await checkbyusernameAndNation(
        values.userName as string,
        values.nation as string
      );
      setDeleteList(() => res.data.map((item: any) => item.domainName));
      console.log(res);
      messageApi.open({
        type: "success",
        content: res.message,
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "查询失败",
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
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
    "",
  ];

  // 切换输入框类型
  const [custom, setCustom] = useState(false);
  const changeInput = (checked: boolean) => {
    setCustom(checked);
  };

  // 选中列表
  const [checkedList, setCheckedList] = useState<string[]>([]);
  // 全选
  const checkAll = deleteList.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < deleteList.length;

  // 多选按钮变化时的回调函数
  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  // 全选按钮变化时的回调函数
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? deleteList : []);
  };

  // 批量删除域名
  const del = () => {
    setIsModalOpen(true);
  };

  // 对话框
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 确定删除
  const handleOk = async () => {
    setIsModalOpen(false);
    // 构造请求参数
    const nations = formData.nation || [];
    const userName = formData.userName || [];
    const body = {
      nation: nations[0],
      userName: userName[0],
      domainNameArr: checkedList,
    };
    console.log(body);
    try {
      const res = await deletebydomainNameArr(body);
      console.log(res);
      messageApi.open({
        type: "success",
        content: "删除成功",
      });
      setDeleteList([]);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "删除失败",
      });
    }
  };

  // 取消删除
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [messageApi, contextHolder] = message.useMessage(); // 关键！

  return (
    <div>
      {/* 提示 */}
      {contextHolder} {/* 必须添加在组件最外层 */}
      <Result
        style={{ padding: "20px" }}
        icon={<FileExcelOutlined />}
        title="删除后台"
      />
      {/* 查询 */}
      <Form
        name="basic"
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          margin: "auto",
          border: "1px solid #eee",
          padding: "20px",
          borderRadius: "8px",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="广告类型"
          name="nation"
          rules={[{ required: true, message: "请输入广告类型:日本-减肥" }]}
        >
          <Select mode="multiple" placeholder="请选择用户名">
            {templates.map((user: string, index: number) => {
              return (
                <Option key={index} value={user}>
                  {user}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

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
            name="userName"
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
        </div>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
      {/* 域名列表 */}
      {deleteList.length > 0 && (
        <div style={{ margin: "20px" }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          {/* 分割线 */}
          <Divider />
          <CheckboxGroup
            options={deleteList}
            value={checkedList}
            onChange={onChange}
          />

          {/* 批量删除后台 */}
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              icon={<DeleteFilled />}
              onClick={del}
              disabled={!(checkedList.length > 0)}
              type="primary"
              danger
            >
              批量删除后台
            </Button>
          </div>
        </div>
      )}
      {/* 对话框 */}
      <Modal
        title="是否删除以下域名后台？"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
      >
        {checkedList.map((item) => (
          <Tag key={item} color="red" style={{ margin: "5px" }}>
            {item}
          </Tag>
        ))}
      </Modal>
      {/* 悬浮按钮 */}
      <FButton />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  // 存储返回的后台数据
  let dataLines = null;
  try {
    // 发送请求：根据 id 获取问卷数据
    const res = await getQuestionByuserName("lkk");
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
