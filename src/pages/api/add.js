import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { nation, lineArr } = req.body;
    console.log(nation, lineArr);
    // 构建数据格式
    function createlineList() {
      const data = lineArr.map((line) => {
        // 以 ',' 分割数据
        const spliceLine = line.toString().split(",");
        // 数据格式
        const obj = {
          status: 0, // 上线/下线(0为下线)
          comment: spliceLine[1], // 备注
          lineName: spliceLine[2], // line号名称
          link: spliceLine[0], // line链接
          pixels: "123456789", // 广告像素
          clickNum: 0, // 点击次数
        };
        return obj;
      });
      return data;
    }

    // // 验证 URL 格式
    // const isValidUrl = (url) => {
    //   try {
    //     new URL(url);
    //     return true;
    //   } catch {
    //     return false;
    //   }
    // };

    // if (!isValidUrl(link)) {
    //   return res.status(400).json({ message: "无效的URL格式" });
    // }

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 新增数据
    const result = db.collection("dataEntries").updateMany(
      { nation },
      {
        $push: {
          lines: {
            $each: createlineList(),
            $position: 0, // 插入到数组开头
          },
        },
      }
    );

    res.status(201).json({
      message: "添加成功",
      data: { ...result, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
