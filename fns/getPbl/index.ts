import cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();
const _ = db.command;

export const main = async (event, context) => {
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

  return data.map(({ _id, nickName, avatarUrl, score }, index) => ({
    openid: _id,
    nickName,
    avatarUrl,
    score,
    key: index + 1,
  }));
};
