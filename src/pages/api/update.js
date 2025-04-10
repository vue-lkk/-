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
    const { key, _id, domainName, lineName, pixels, comment } = req.body;
    console.log(key, _id, domainName, lineName, pixels, comment);

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 统一修改 像素
    if (pixels) {
      db.collection("dataEntries").updateOne(
        {
          // _id: new ObjectId(_id),
          domainName,
        },
        {
          $set: {
            "lines.$[].pixels": pixels.replace(/\s+/g, ""), // 去除所有空格 // 使用 $ 定位符匹配数组元素
          },
        }
      );
    }

    // 修改 备注 和 号名
    db.collection("dataEntries").updateOne(
      {
        // _id: new ObjectId(_id),
        domainName,
      },
      {
        $set: {
          [`lines.${key}.comment`]: comment.replace(/\s+/g, ""), // 动态索引
          [`lines.${key}.lineName`]: lineName.replace(/\s+/g, ""),
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
