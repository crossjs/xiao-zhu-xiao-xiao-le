import * as cloud from "wx-server-sdk";

cloud.init();

const offset = 8 * 60 * 60 * 1000;
const oneDay = offset * 3;

export const main = async (event, context) => {
  const now = Date.now() + offset;
  const begin = now - now % oneDay - offset;
  const end = now + oneDay;

  return {
    begin,
    now,
    end,
  };
};
