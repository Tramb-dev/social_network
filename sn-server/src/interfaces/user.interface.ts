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
  sendedFriendRequests?: string[];
  receivedFriendRequests?: string[];
  friends?: string[];
}

export interface VerifiedToken {
  uid: string;
  email: string;
  rightsLevel: RightsLevels;
  iat: number;
  exp: number;
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

export interface RandomUser {
  uid: string;
  firstName: string;
  lastName: string;
  picture?: string;
  isConnected: boolean;
  alreadyFriend: boolean;
  requested: boolean;
}
