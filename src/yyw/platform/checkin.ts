namespace yyw {
  const CHECKIN_KEY = "CHECKIN";

  async function getMyCheckins() {
    return await yyw.db.get(CHECKIN_KEY) || [];
  }

  export const checkin = {
    async get(): Promise<any> {
      const myCheckins = await getMyCheckins();
      const day = new Date().getDay() || 7;
      const days = [];
      for (let index = 0; index < 7; index++) {
        days[index] = {
          offset: index + 1 - day,
          checked: myCheckins.indexOf(index) !== -1,
        };
      }
      return days;
    },

    async save(index: number): Promise<any> {
      const { now, end } = getNowEnd("week");
      const expiresIn = end - now;
      const myCheckins = await getMyCheckins();
      yyw.db.set(CHECKIN_KEY, myCheckins.concat(index), expiresIn);
    },
  };
}
