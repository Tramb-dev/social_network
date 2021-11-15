export interface User {
  uid: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  isConnected: boolean;
  rightsLevel: RightsLevels;
  creationDate?: Date;
  lastUpdated?: Date;
}

export enum RightsLevels {
  ADMIN = 1,
  MEMBER,
  NOT_CONNECTED,
}
