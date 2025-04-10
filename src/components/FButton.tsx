import {
  PoweroffOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { useRouter } from "next/router"; // pages router

export default function FButton(context: any) {
  const router = useRouter();

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
    <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
      <FloatButton
        tooltip={<div>首页</div>}
        icon={<PoweroffOutlined />}
        onClick={toHome}
      />
      <FloatButton
        tooltip={<div>新建后台</div>}
        icon={<FileAddOutlined />}
        onClick={toTemplate}
      />
      <FloatButton
        tooltip={<div>删除后台</div>}
        icon={<FileExcelOutlined />}
        onClick={toDeletebackstage}
      />
      <FloatButton
        tooltip={<div>查看后台</div>}
        icon={<FileSearchOutlined />}
        onClick={toBackstage}
      />
      <FloatButton.BackTop tooltip={<div>返回顶部</div>} visibilityHeight={0} />
    </FloatButton.Group>
  );
}
