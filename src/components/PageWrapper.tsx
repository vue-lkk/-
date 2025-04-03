import React, { FC, useEffect } from "react";
import Head from "next/head";
// 需要引入Script
// import Script from "next/script";
import styles from "@/styles/Common.module.scss";
import { updateShowDocNum } from "@/services/question";
// import { useParams } from "next/navigation";

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

type PropsType = {
  title: string;
  id?: string;
  desc?: string;
  css?: string;
  js?: string;
  lines?: Array<checkeLine>;
  children: JSX.Element | JSX.Element[];
};

const PageWrapper: FC<PropsType> = (props: PropsType) => {
  const { title, id = "", desc, css, js = "", lines = [], children } = props;
  // console.log("@", js);
  // const { id = "" } = useParams();
  // 更新页面展示次数
  useEffect(() => {
    const update = async () => {
      await updateShowDocNum(id as string, lines[0].link);
    };
    update();
  }, [id, lines]);

  useEffect(() => {
    // 动态创建 <script> 标签
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
        "holdConsent",
        "revokeConsent",
        "grantConsent",
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
            o = n && n.partner;
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = r),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          n = document.createElement("script");
          (n.type = "text/javascript"),
            (n.async = !0),
            (n.src = r + "?sdkid=" + e + "&lib=" + t);
          e = document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(n, e);
        });
      ttq.load(${
        lines.length > 0
          ? JSON.stringify(lines && lines[0].pixels)
          : JSON.stringify("123456789")
      } );
      ttq.page();
    })(window, document, "ttq");
    `;

    // 将脚本插入到 <head>
    document.head.appendChild(script);

    return () => {
      // 在组件卸载时移除脚本
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* 页面：html部分 */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* 页面：css设置 */}
        <style>{css}</style>
        <script id="Pixel" dangerouslySetInnerHTML={{ __html: js }}></script>
      </Head>

      {/* 插槽：渲染组件列表 */}
      <main className={styles.container}>{children}</main>

      {/* 页面：js设置 */}
      {/* <Script id="page-js">{js}</Script> */}
    </>
  );
};
export default PageWrapper;
