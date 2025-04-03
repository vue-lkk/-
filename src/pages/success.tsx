// 引入公共部分
// import PageWrapper from "@/components/PageWrapper";
import Head from "next/head";

export default function Success() {
  return (
    // <>
    //   <PageWrapper title="提交成功">
    //     <div>
    //     <h1>成功</h1>
    //     <p>问卷提交通过</p>
    //     </div>
    //   </PageWrapper>
    // </>

    <>
      {/* 页面：html部分 */}
      <Head>
        <title>提交</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 插槽：渲染组件列表 */}
      <main>
        <div>
          <h1>成功</h1>
          <p>问卷提交通过</p>
        </div>
      </main>
    </>
  );
}
