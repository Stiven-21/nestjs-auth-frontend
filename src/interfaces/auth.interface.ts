export interface DecodedToken {
  sub: number;
  sessionId: number;
  email: string;
  role: {
    name: string;
    permissions: string[];
  };
  iat: number;
  exp: number;
}

export interface BackendLoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    email: string;
    user: string;
    role: string;
    permissions: string[];
  };
  meta: {
    action: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  };
  error: null | string;
}

export interface BackendRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    email: string;
    user: string;
    role: string;
    permissions: string[];
  };
  meta: {
    action: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  };
  error: null | string;
}

export interface UserLogged {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}
