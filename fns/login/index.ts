import cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

/**
 * userInfo 已经被系统占用了
 * 所以外部传入，使用 fullUserInfo
 */
export const main = async ({ fullUserInfo }, context) => {
  const { OPENID: openid, UNIONID: unionid } = cloud.getWXContext();

  const user = {
    unionid,
    score: 0,
    level: 0,
    combo: 0,
    points: 0,
    coins: 0,
    scores: 0,
    played: 0,
    enabled: true,
  };

  const doc = db
    .collection("users")
    .doc(openid);

  let isNew = true;

  try {
    const { data: {
      score,
      level,
      combo,
      points,
      coins,
      scores,
      played,
      nickName,
      avatarUrl,
    } } = await doc.get();

    Object.assign(user, {
      score,
      level,
      combo,
      points,
      coins,
      scores,
      played,
      nickName,
      avatarUrl,
    });

    isNew = false;
  } catch (error) {
    console.error(error);
  }

  Object.assign(user, fullUserInfo);

  if (isNew) {
    await doc.set({
      data: {
        ...user,
        created: db.serverDate(),
      }
    });
  } else {
    await doc.update({
      data: {
        ...user,
        updated: db.serverDate(),
      }
    });
  }

  return {
    openid,
    ...user,
  };
};
