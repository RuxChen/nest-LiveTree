export interface AccessTokenInfo {
  accessToken: string;
  expiresIn: number;
  getTime: number;
  openid: string;
}

export interface AccessConfig {
  access_token: string;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
  expires_in: number;
}

export interface WechatError {
  errcode: number;
  errmsg: string;
}

export interface WechatUserInfo {
  open_id: string;
  nick_name: string;
  sex: number;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
}
