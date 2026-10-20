type User = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

type UserRole = 'Admin' | 'User' | 'Guest';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
