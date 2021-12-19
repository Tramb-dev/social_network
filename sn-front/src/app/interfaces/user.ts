import { RightsLevels } from "./auth";

export interface User {
  uid: string;
  email: string;
  password?: string;
  token?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  picture?: string;
  isConnected: boolean;
  rightsLevel: RightsLevels;
  creationDate?: Date;
  lastUpdated?: Date;
  sendedFriendRequests?: string[];
  receivedFriendRequests?: string[];
  friends?: string[];
}

export interface UserCreation {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "dateOfBirth";

export interface RandomUser {
  uid: string;
  firstName: string;
  lastName: string;
  picture?: string;
  isConnected: boolean;
  alreadyFriend: boolean;
  requested: boolean;
}
