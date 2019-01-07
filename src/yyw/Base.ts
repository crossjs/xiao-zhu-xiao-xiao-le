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
  export const origin: string = "http://127.0.0.1:7014";
  export const user: IUser = {};
}
