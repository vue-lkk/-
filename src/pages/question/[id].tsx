import React from "react";
import styles from "@/styles/Question.module.scss";
import { getLineByDomainName, getQuestionById } from "@/services/question";
import PageWrapper from "@/components/PageWrapper";
import { getComponent } from "@/components/QuestionCompoents";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, List, Skeleton, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// 上线的line类型数据
type checkeLine = {
  clickNum: number;
  comment: string;
  lineName: string;
  link: string;
  pixels: string;
  showDocumentNum: number;
  status: number;
  switch: number;
};

// 请求返回的数据类型
type PropsType = {
  data: {
    code: number;
    data?: {
      fe_id: string;
      title: string;
      desc?: string;
      js?: string;
      css?: string;
      isPublished: boolean;
      isDeleted: boolean;
      componentList: Array<any>;
    };
    msg?: string;
  };
  checkeLines: Array<checkeLine>;
  ipCloaks: {
    ipCloak?: boolean; // 屏蔽
    isVPNOrProxy?: boolean; // VPV/代理检测
    device_type?: boolean; // 设备'PC' | 'mobile'
    country_code: Array<string>; //国家代码
    language: boolean; // 语言
  };
};

// 屏蔽器数据类型
type IpCloakDataType = {
  status: string;
  ip: string;
  language: string;
  languageInfo: string;
  userAgent: string;
  app: string;
  isKnown: boolean;
  device_type: string;
  proxy_type: string;
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  VPN: boolean;
  ASN: number;
  ISP: string;
  country_code: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

export default function Question(props: PropsType) {
  const { code, data, msg } = props.data;
  console.log(props.data);
  const router = useRouter();
  // 屏蔽器数据
  const [ipCloakData, setIpCloakData] = useState<IpCloakDataType | undefined>(
    undefined
  );
  // 加载中...
  const [loading, setLoading] = useState(true); // 用于控制加载状态

  useEffect(() => {
    // 发起请求
    axios
      // .get("https://266aaa111.shop:9902/api/third_party_api")
      .get("https://266aaa111.shop:9902/api/maxmind")
      .then((response) => {
        console.log(response.data);
        setIpCloakData(response.data); // 设置返回数据
      })
      .catch((error) => {
        console.error("请求错误:", error);
      })
      .finally(() => {
        setLoading(false); // 无论请求成功还是失败，都会更新加载状态
      });
  }, []); // 空依赖数组，表示只在组件挂载时发起请求

  useEffect(() => {
    console.log("@@", process.env.NODE_ENV, process.env.API_URL);
  }, []);

  const {
    fe_id,
    title = "",
    isDeleted,
    isPublished,
    desc,
    componentList = [],
    css,
    js,
  } = data || {};

  const handleRedirect = () => {
    router.push("/success"); // 跳转到 /success 页面
  };

  // 数据错误
  if (code !== 0) {
    return (
      <PageWrapper title="错误">
        <h1>错误</h1>
        <p>{msg}</p>
      </PageWrapper>
    );
  }

  // 已删除的问卷,提示错误
  if (isDeleted) {
    return (
      <PageWrapper title={title} desc={desc}>
        <h1>{title}</h1>
        <p>该问卷已经被删除</p>
      </PageWrapper>
    );
  }

  // 尚未发布的问卷，提示错误
  if (!isPublished) {
    return (
      <PageWrapper title={title} desc={desc}>
        <h1>{title}</h1>
        <p>该问卷尚未发布</p>
      </PageWrapper>
    );
  }

  // 遍历组件
  const ComponentList = (
    <>
      {componentList.map((c) => {
        const Component = getComponent(c, props.checkeLines);
        return (
          <div key={c.fe_id} style={{ marginBottom: "16px" }}>
            {Component}
          </div>
        );
      })}
    </>
  );

  // 使用映射对象简化语言匹配逻辑
  const languageMap: { [key: string]: string[] } = {
    CN: ["zh", "zh-CN"],
    KR: ["ko", "ko-KR"],
    JP: ["ja", "ja-JP"],
    US: ["en", "en-US"],
  };

  // 优化语言匹配函数
  const isLanguage = (
    user_language: boolean,
    country_code: string,
    language: string
  ): boolean => {
    if (!user_language) return true; // 如果用户未启用语言过滤，直接返回 true

    // 使用映射对象检查国家和语言是否匹配
    const validLanguages = languageMap[country_code] || [];
    return validLanguages.includes(language);
  };

  // 合并和优化逻辑判断
  const real = () => {
    const {
      country_code,
      device_type,
      language,
      isKnown,
      is_proxy,
      is_vpn,
      is_tor,
      VPN,
    } = ipCloakData as IpCloakDataType;

    const {
      country_code: user_country_code,
      device_type: user_device_type,
      ipCloak,
      isVPNOrProxy,
      language: user_language,
    } = props.ipCloaks;
    console.log(props.ipCloaks);

    // 判断是否需要阻止访问（有VPN/代理/TOR等）
    const isBlockedByVPNOrProxy =
      isVPNOrProxy && (isKnown || is_proxy || is_vpn || is_tor || VPN);
    if (isBlockedByVPNOrProxy) return false;

    // 判断是否启用了屏蔽器，并且用户IP属于允许访问的国家且语言匹配
    if (ipCloak && user_country_code.length > 0) {
      const isCountryValid = user_country_code.includes(country_code);
      const isLanguageValid = isLanguage(user_language, country_code, language);

      if (isCountryValid && isLanguageValid) {
        // 判断设备类型
        if (user_device_type) {
          return device_type === "mobile";
        } else {
          return true; // 渲染真实页面
        }
      }
      return false; // 渲染假页面
    }

    return true; // 渲染真实页面
  };

  const listData = Array.from({ length: 3 }).map((_, i) => ({
    href: "https://ant.design",
    title: `ant design part ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  }));
  // 页面加载状态，等待数据加载完成
  if (loading) {
    return (
      <>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={listData}
          renderItem={(item) => (
            <List.Item>
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
        <div style={{ textAlign: "center", margin: "auto" }}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      </>
    );
  }

  return (
    <PageWrapper
      title={title}
      id={fe_id}
      desc={desc}
      css={css}
      js={js}
      lines={props.checkeLines}
    >
      {real() ? (
        <form
          method="post"
          action={
            process.env.NODE_ENV === "development"
              ? "/api/answer"
              : `${process.env.API_URL}/api/answer`
          }
        >
          {/* 隐藏域:收集画页的id */}
          <input type="hidden" name="questionId" defaultValue={fe_id} />
          {/* 组件列表 */}
          {ComponentList}
          <div className={styles.submitBtnContainer}>
            {/* 利用 input 或者 button 来提交，都必须加上 type="submit" */}
            <button type="submit">提交</button>
          </div>
        </form>
      ) : (
        // 假页面
        <div
          style={{
            width: "100%",
            margin: "10% auto 0",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ paddingLeft: "2% " }}>恭喜, 站点创建成功！</h1>
          <h3 style={{ paddingLeft: "2% " }}>
            这是默认index.html，本页面由系统自动生成
          </h3>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ lineHeight: 2.3 }}>本页面在FTP根目录下的index.html</li>
            <li style={{ lineHeight: 2.3 }}>您可以修改、删除或覆盖本页面</li>
            <li style={{ lineHeight: 2.3 }}>
              FTP相关信息，请到“面板系统后台 》 FTP” 查看
            </li>
          </ul>
        </div>
      )}
    </PageWrapper>
  );
}

// 请求
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
  const { id = "" } = context.params;
  // 存储画页信息
  let data = null;
  // 存储上线的链接数组
  let checkeLines = [];
  // 存储屏蔽器数据
  let ipCloaks = {};

  try {
    // 发送请求：根据 id 获取问卷数据
    data = await getQuestionById(id);
    const { fe_id } = data.data;

    if (fe_id) {
      // 获取画页的 lines 数据
      const lines = await getLineByDomainName(fe_id);
      const { data } = lines;
      // 筛选上线的链接
      if (data.lines) {
        checkeLines = data.lines.lineMessage.filter((line: any) => {
          return line.status === 1;
        });
      }
      if (data.lines.ipCloak) {
        ipCloaks = data.lines.ipCloak;
      }
    }
  } catch (error) {
    console.error("获取数据失败", error);
    data = { code: 1, msg: "数据获取失败" };
  }

  return {
    props: { data, checkeLines, ipCloaks },
  };
}
