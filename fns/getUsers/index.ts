import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();
const _ = db.command;

export const main = async ({ mode = "new" }: any, context: any) => {
  const cl = db.collection("users");

  const { result: { begin }} = await cloud.callFunction({
    // 要调用的云函数名称
    name: "dateUtil",
  });

  let orderBy: string = "score";

  const field = {
    nickName: true,
  };

  const where: any = {};

  switch (mode) {
    case "new":
      Object.assign(where, {
        createdAt: _.gte(begin),
      });
      orderBy = "createdAt";
      break;
    case "active":
      Object.assign(where, {
        updatedAt: _.gte(begin),
      });
      orderBy = "updatedAt";
      break;
  }

  const { total } = await cl
    .where(where)
    .count();

  const { data } = await cl
    .where(where)
    .orderBy(orderBy, "desc")
    .field(field)
    .get();

  return {
    begin,
    total,
    items: data,
  };
};
