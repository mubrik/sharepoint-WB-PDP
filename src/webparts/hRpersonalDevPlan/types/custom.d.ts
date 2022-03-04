export const initialAppData:IAppData = {
  draftAvailable: false,
  viewPageMode: "normal",
  linkedItemId: null
};

export interface IUserData {
  ok?: boolean;
  id?: number;
  email?: string;
  displayName?: string;
  manager?: string;
  jobTitle?: string;
  isUserHr? : boolean;
  isUserManager? : boolean;
  isUserGroupHead? : boolean;
}

export interface IAppData {
  draftAvailable: boolean;
  viewPageMode: "normal"|"linked";
  linkedItemId: number|null;
}

export interface IValidState {
  bioData: IValidationObj;
  yearData: IValidationObj;
  trainData: IValidationObj;
  state: IValidationObj;
}

export interface IValidationObj {
  valid: boolean;
  msg: string;
  location?: string;
}
// interface for form year data
export interface IFormYearData {
  [key: string]: string;
}

export interface IFormTrainingData {
  [key: string]: ISingleTrainingData;
}

export interface IFormBioData {
  stakeHolder1: string;
  stakeHolder2: string;
  strengthWeakness: string;
  continousImprovement: string;
  stepsTaken: string;
}

// interface for single training data
export interface ISingleTrainingData {
  trainingTitle: string;
  trainingObjective: string;
  trainingStatus: string;
  trainingDuration: string;
}

export interface IFormUserData {
  username: string;
  lineManager: string;
  jobTitle: string;
}
