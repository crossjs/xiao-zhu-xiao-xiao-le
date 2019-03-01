namespace yyw {
  export function getNowDayEnd() {
    const now = new Date();
    const day = now.getDay() || 7;
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7 - day,
      23,
      59,
      59,
    );
    return { now, day, end };
  }
}
