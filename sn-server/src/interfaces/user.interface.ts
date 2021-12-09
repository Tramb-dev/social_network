export interface User {
  uid: string;
  email: string;
  password: string;
  token?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  picture?: string;
  isConnected: boolean;
  rightsLevel: RightsLevels;
  creationDate?: Date;
  lastUpdated?: Date;
  resetLink?: string;
  resetTime?: number;
}

export const enum RightsLevels {
  ADMIN = 1,
  MEMBER,
  NOT_CONNECTED,
}

export interface SigninCredentials {
  email: string;
  password?: string;
  uid?: string;
}
