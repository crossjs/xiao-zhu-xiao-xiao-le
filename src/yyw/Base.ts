interface IUser {
  accessToken?: string;
  avatar?: string;
  avatarUrl?: string;
  coins?: number;
  createdAt?: number;
  enabled?: boolean;
  id?: string;
  nickname?: string;
  point?: number;
  provider?: string;
  providerId?: string;
  updatedAt?: number;
  username?: string;
}

namespace yyw {
  export const GAME_SERVER_ENABLED: boolean = true;
  export const GAME_SERVER_ORIGIN: string = DEBUG ? "http://127.0.0.1:7014" : "https://g4.minipx.cn";
  export const CURRENT_USER: IUser = {};
  export const SYSTEM_INFO = wx.getSystemInfoSync();
}
