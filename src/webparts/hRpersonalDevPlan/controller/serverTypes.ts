import { sp } from "@pnp/sp/presets/core";
import {IFormYearData, IFormTrainingData, IFormBioData, IFormUserData} from "../components/dataTypes";

/* interface */
export interface IServer {
  fetch: typeof sp;
  testing(): Promise<void>;
  getUser(): Promise<IUserData>;
  getUserList(username: string):Promise<ISPFullObj[]>;
  getListById(id: number): Promise<ISPFullObj>;
  userDraftExists(username: string): Promise<boolean>;
  getHrList(username: string): Promise<ISPFullObj[]>;
  getLineManagerList(username: string): Promise<ISPFullObj[]>;
  getGroupHeadList(username: string): Promise<ISPFullObj[]>;
  createEntry(
    userData: IFormUserData,
    yearData: IFormYearData,
    trainData: IFormTrainingData,
    stakeHolderData: IFormBioData): Promise<boolean>;
  updateEntry(id: number, param: object): Promise<boolean>;
  deleteEntry(id: number): Promise<boolean>;
  approveRejectEntry(id: number, userType: string, param: "approved"|"rejected"): Promise<boolean>;
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
  trainingStatus1?: string;
  trainingDuration1?: string;
  trainingTitle2?: string;
  trainingObjective2?: string;
  trainingStatus2?: string;
  trainingDuration2?: string;
  trainingTitle3?: string;
  trainingObjective3?: string;
  trainingStatus3?: string;
  trainingDuration3?: string;
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

export interface IPartialSPdata {
  [key: string]: string;
}
