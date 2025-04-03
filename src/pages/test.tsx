import { useState, useEffect } from "react";
import { getToLines } from "@/services/line";
import { Button, message, Spin } from "antd";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [domainName, setDomainName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query.domainName) {
      setDomainName(router.query.domainName as string);
    }
  }, [router.isReady, router.query]);

  const getLines = async () => {
    if (!domainName) {
      message.warning("等待参数初始化...");
      return;
    }

    setLoading(true);
    try {
      const res = await getToLines(domainName);
      console.log("API响应:", res);
      message.success("请求成功");
    } catch (error) {
      console.error("API请求失败:", error);
      // message.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!router.isReady) return <Spin tip="路由初始化..." />;

  return (
    <div>
      <Button onClick={getLines} loading={loading} type="primary">
        {loading ? "请求中..." : `获取 ${domainName} 数据`}
      </Button>
    </div>
  );
}
