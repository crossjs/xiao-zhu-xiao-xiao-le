import * as cloud from "wx-server-sdk";

cloud.init({ env: "dev-529ffe" });

const db = cloud.database();

export const main = async ({ channel, aId, traceId }, context) => {
  const { OPENID: openid } = cloud.getWXContext();

  const { result: { now }} = await cloud.callFunction({
    name: "dateUtil",
  });

  return await db
    .collection("traces")
    .add({
      data: {
        channel,
        aId,
        traceId,
        openid,
        createdAt: now,
      },
    });
};
