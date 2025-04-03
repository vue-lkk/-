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

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("line");
    const { id, domainName } = req.query;

    // 执行获取上线链接
    const result = await db
      .collection("dataEntries")
      .find({
        $or: [
          {
            domainName: { $regex: new RegExp(`^${domainName}$`, "i") },
          },
          {
            _id: new ObjectId(id),
          },
        ],
      })
      .toArray();

    if (result.length > 0) {
      const { _id, userName, nation, banned, lines } = result[0];
      const topLines = lines.filter((item) => {
        if (item.status == 1) {
          return item;
        }
      });

      if (banned) {
        res.status(201).json({
          message: "获取错误",
        });
        return;
      }
      res.status(201).json({
        message: "获取成功",
        data: {
          _id,
          userName,
          nation,
          banned,
          domainName: result[0].domainName,
          topLines,
        },
      });
    } else {
      res.status(201).json({
        message: "后台不存在",
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
