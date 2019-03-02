import * as cloud from "wx-server-sdk";

cloud.init();

const db = cloud.database();

export const main = async (event, context) => {
  const { data } = await db
    .collection("tasks")
    .where({ enabled: true })
    .get();

  return data;
};
