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
        // 以英文 ',' 或者中文 '，' 分割数据
        const spliceLine = line.toString().split(/[,，]\s*/);
        console.log("分割数据", spliceLine);
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

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line");

    // 获取所有新数据
    const newLines = createlineList();

    // 获取所有新链接和lineName
    const newLinks = newLines.map((line) => line.link);
    const newLineNames = newLines.map((line) => line.lineName);

    // 查询已存在的记录（匹配link或lineName）
    const existingLines = await db.collection("dataEntries").findOne(
      {
        nation,
        $or: [
          { "lines.link": { $in: newLinks } },
          { "lines.lineName": { $in: newLineNames } },
        ],
      },
      { "lines.link": 1, "lines.lineName": 1 }
    );

    // 获取已存在的链接和lineName集合
    const existingLinks = existingLines
      ? existingLines.lines.map((line) => line.link)
      : [];
    const existingLineNames = existingLines
      ? existingLines.lines.map((line) => line.lineName)
      : [];

    // 过滤掉已存在的记录（link或lineName任一重复都视为重复）
    const linesToInsert = newLines.filter(
      (line) =>
        !existingLinks.includes(line.link) &&
        !existingLineNames.includes(line.lineName)
    );

    // 收集重复信息用于反馈
    const duplicateEntries = newLines
      .filter(
        (line) =>
          existingLinks.includes(line.link) ||
          existingLineNames.includes(line.lineName)
      )
      .map((line) => ({
        link: line.link,
        lineName: line.lineName,
        reason: [
          existingLinks.includes(line.link) ? "链接已存在" : "",
          existingLineNames.includes(line.lineName) ? "lineName已存在" : "",
        ]
          .filter(Boolean)
          .join("，"),
      }));

    if (linesToInsert.length === 0) {
      return res.status(200).json({
        message: "没有新数据需要添加，所有记录已存在",
        duplicates: duplicateEntries,
        data: { insertedCount: 0 },
      });
    }

    // 使用 Map 根据 lineName 去重
    const uniqueMap = new Map();

    linesToInsert.forEach((item) => {
      // 如果 Map 中已有该 lineName，则跳过（保留第一个出现的）
      // 如果想保留最后一个出现的，直接覆盖即可
      if (!uniqueMap.has(item.lineName)) {
        uniqueMap.set(item.lineName, item);
      }
    });

    // 转换为数组
    const uniqueData = Array.from(uniqueMap.values());

    console.log("去重后的数据:", uniqueData);

    // 批量新增不重复的数据
    const result = await db.collection("dataEntries").updateMany(
      { nation },
      {
        $push: {
          lines: {
            $each: uniqueData,
            $position: 0, // 插入到数组开头
          },
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      message:
        newLines.length === uniqueData.length
          ? "全部数据添加成功"
          : "部分数据添加成功",
      insertedCount: uniqueData.length,
      duplicates: duplicateEntries.length > 0 ? duplicateEntries : undefined,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
