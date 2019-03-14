import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();
const _ = db.command;

export const main = async (event: any, context: any) => {
  const { data } = await db
    .collection("users")
    .where({
      enabled: true,
      nickName: _.neq(null),
      score: _.neq(0),
    })
    .limit(100)
    .field({
      nickName: true,
      avatarUrl: true,
      score: true,
    })
    .get();

  return data.map(({ _id, nickName, avatarUrl, score }, index: number) => ({
    openid: _id,
    nickName,
    avatarUrl,
    score,
    key: index + 1,
  }));
};
