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
    const { userName, domainName, nation } = req.body;
    console.log("新建后台：", userName, domainName, nation);

    // 验证必要字段
    if (!userName || !domainName || !nation) {
      return res.status(400).json({ message: "用户名称、域名、国家为必填项" });
    }

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    // 根据 广告类型、模板用户【lkk】 查询对应的模板
    const result = await db.collection("dataEntries").findOne({
      nation,
      userName: { $regex: new RegExp(`^lkk$`, "i") },
    });

    // 构建数据对象
    const dataEntry = {
      userName, // 用户名称
      domainName, // 域名名称
      nation, // 国家
      lines: result.lines || [], // line所有相关信息
      banned: false,
      createdAt: new Date(),
    };

    // 是否已经创建过后台
    const validDomainName = await db
      .collection("dataEntries")
      .findOne({ domainName });

    if (validDomainName) {
      res.status(201).json({
        code: 202,
        message: "后台已存在，无需再创建",
      });
    } else {
      // 插入数据库
      const result = await db.collection("dataEntries").insertOne(dataEntry);

      res.status(201).json({
        code: 201,
        message: "后台创建成功",
        data: { ...dataEntry, _id: result.insertedId },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
