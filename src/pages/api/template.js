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
    console.log(userName, domainName, nation);

    // 验证必要字段
    if (!userName || !domainName || !nation) {
      return res.status(400).json({ message: "用户名称、域名、国家为必填项" });
    }

    // 连接数据库
    const client = await clientPromise;
    const db = client.db("line"); // 替换为你的数据库名

    let lines = "";
    // 构建数据格式
    function createlineList() {
      switch (nation) {
        case "日本-减肥":
          lines = [
            "https://lin.ee/tgP6Rr7,芙蓉,@577fmvgs",
            "https://lin.ee/8VlH1q6,芙蓉,@158demzd",
          ];
          break;
        case "韩国-减肥":
          lines = [
            "http://pf.kakao.com/_DCxfCn/chat,312,iem001",
            "http://pf.kakao.com/_jxikCn/chat,飞跃,709jsf",
          ];
          break;
        case "日本-男科":
          lines = [
            "https://works.do/5J7G6uR,男科,4532",
            "https://works.do/xQIUItm,男科,qfy162",
            "https://works.do/52LoLYw,男科,qfy956",
            "https://works.do/FoC8NXz,男科,qfy746",
            "https://works.do/5TI5A0p,男科,qfy553",
          ];
          break;
        case "韩国-男科":
          lines = [
            "http://pf.kakao.com/_fTpGn/chat,韩国男科,kse639",
            "http://pf.kakao.com/_FxhDGn/chat,韩国男科,art300",
            "http://pf.kakao.com/_EgxkGn/chat,韩国男科,uth517",
            "http://pf.kakao.com/_xexlpGn/chat,韩国男科,opd906",
            "http://pf.kakao.com/_vxnDGn/chat,韩国男科,fre632",
            "http://pf.kakao.com/_DfDGn/chat,韩国男科,tav901",
          ];
          break;
        case "日本-丰胸":
          lines = [
            "https://line.me/R/ti/p/@112fquyb,丰胸,@112fquyb",
            "https://line.me/R/ti/p/@429cpyky,丰胸,@429cpyky",
            "https://line.me/R/ti/p/@358oezlx,丰胸,@358oezlx",
            "https://line.me/R/ti/p/@647lnwpj,丰胸,@647lnwpj",
          ];
          break;
        case "韩国-丰胸":
          lines = [];
          break;
        default:
          lines = [];
          break;
      }

      const data = lines.map((line) => {
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

    // 构建数据对象
    const dataEntry = {
      userName, // 用户名称
      domainName, // 域名名称
      nation, // 国家
      lines: createlineList() || [], // line所有相关信息
      createdAt: new Date(),
    };

    // 是否已经创建过后台
    const validDomainName = await db
      .collection("dataEntries")
      .findOne({ domainName });

    console.log(validDomainName);
    if (validDomainName) {
      res.status(201).json({
        code: 202,
        message: "后台模板已存在，无需再创建",
      });
    } else {
      // 插入数据库
      const result = await db.collection("dataEntries").insertOne(dataEntry);

      res.status(201).json({
        code: 201,
        message: "后台模板创建成功",
        data: { ...dataEntry, _id: result.insertedId },
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}
