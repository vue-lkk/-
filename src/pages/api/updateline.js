import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

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
    const { _id, domainName, lineName, status } = req.body;
    console.log(_id, lineName, status);

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 修改上线/下线
    db.collection("dataEntries").updateOne(
      {
        // _id: new ObjectId(_id),
        domainName,
        "lines.lineName": lineName,
      },
      {
        $set: {
          "lines.$.status": status, // 使用 $ 定位符匹配数组元素
          "lines.$.updatedAt": new Date(), // 添加更新时间戳
        },
      }
    );

    res.status(201).json({
      message: "更新成功",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
