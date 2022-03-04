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

export interface IAppDataWithSetState extends IAppData {
  setAppSettings: React.Dispatch<React.SetStateAction<IAppData>>;
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

export interface ISPBioDataObj {
  stakeHolder1?: string;
  stakeHolder2?: string;
  strengthWeakness?: string;
  stepsTaken?: string;
  continousImprovement?: string;
}

/* user data object received after filter*/
export interface ISPTrainingDataObj{
  trainingTitle1?: string;
  trainingObjective1?: string;
  trainingStatus1?: number;
  trainingDuration1?: string;
  trainingTitle2?: string;
  trainingObjective2?: string;
  trainingStatus2?: number;
  trainingDuration2?: string;
  trainingTitle3?: string;
  trainingObjective3?: string;
  trainingStatus3?: number;
  trainingDuration3?: string;
  trainingTitle4?: string;
  trainingObjective4?: string;
  trainingStatus4?: number;
  trainingDuration4?: string;
}

export interface ISPYearGoalsObj{
  year1?: string;
  yearGoal1?: string;
  year2?: string;
  yearGoal2?: string;
  year3?: string;
  yearGoal3?: string;
}

export interface ISPFullObj extends ISPTrainingDataObj, ISPYearGoalsObj, ISPBioDataObj {
  Id?: number;
  username?: string;
  yearsTotal?: number;
  trainingTotal?: number;
  recommendation?: string;
  jobTitle?: string;
  lineManager?: string;
  hrManagerStatus?: string;
  lineManagerStatus?: string;
  gcioStatus?: string;
}