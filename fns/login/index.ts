import * as cloud from "wx-server-sdk";

cloud.init({ env: "releas-529ffe" });

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
    coins: 0,
    points: 0,
    energies: 0,
    renewedAt: 0,
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
      coins,
      points,
      energies,
      renewedAt,
      nickName,
      avatarUrl,
      tools,
      arena,
      sticked,
      guided,
    } } = await doc.get();

    Object.assign(user, {
      score,
      level,
      coins,
      points,
      energies,
      renewedAt,
      nickName,
      avatarUrl,
      tools,
      arena,
      sticked,
      guided,
    });

    isNew = false;
  } catch (error) {
    console.error(error);
  }

  Object.assign(user, fullUserInfo);

  const { result: { now }} = await cloud.callFunction({
    name: "dateUtil",
  });

  console.log("当前用户：", openid, isNew);

  if (isNew) {
    await doc.set({
      data: {
        ...user,
        createdAt: now,
        updatedAt: now,
      },
    });
  } else {
    await doc.update({
      data: {
        ...user,
        updatedAt: now,
      },
    });
  }

  return {
    openid,
    ...user,
  };
};
