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
    const { id, userName, domainName } = req.query;
    console.log(id, userName, domainName);

    // 感觉域名执行查询
    const result = await db
      .collection("dataEntries")
      .find({
        domainName: { $regex: new RegExp(`^${domainName}$`, "i") },
      })
      .toArray();

    // const result = await db
    //   .collection("dataEntries")
    //   .find({
    //     $or: [
    //       {
    //         userName: { $regex: new RegExp(`^${userName}$`, "i") }, // 精确匹配不区分大小写
    //         domainName: { $regex: new RegExp(`^${domainName}$`, "i") },
    //       },
    //       {
    //         _id: new ObjectId(id),
    //       },
    //     ],
    //   })
    //   .toArray();

    if (result.length > 0) {
      res.status(201).json({
        code: 201,
        message: "获取成功",
        data: { ...result, _id: result.insertedId },
      });
    } else {
      res.status(201).json({
        code: 202,
        message: "后台不存在",
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
