import { RightsLevels } from "./auth";

export interface User {
  uid: string;
  email: string;
  password?: string;
  token?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  isConnected: boolean;
  rightsLevel: RightsLevels;
  creationDate?: Date;
  lastUpdated?: Date;
}

export interface UserCreation {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
