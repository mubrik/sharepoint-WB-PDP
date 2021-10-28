import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {initialFormData} from "../initialDataTypes";

/* interface */
export interface IServer {
  fetch: typeof sp;
  context: WebPartContext|null;
  getUserBioList: () => Promise<any[]| ISPBioDataObj[]>;
  getUserTrainingList: () => Promise<any[]| ISPTrainingDataObj[]>;
  createEntry: (param: typeof initialFormData) => void;
  // createDraft: (param: IServerReqObject) => Promise<void>;
}

// export interface IServerReqObject {
//   week: string;
//   year: string;
//   data: ISPJsFullItemsObj[];
//   status: string;
// }
/* user data object received after filter*/
export interface ISPBioDataObj {
  username: string;
  year1: string;
  year2: string;
  year3: string;
  stakeHolder1: string;
  stakeHolder2: string;
  strengthWeakness: string;
  stepsTaken: string;
  continousImprovement: string;
}

/* user data object received after filter*/
export interface ISPTrainingDataObj{
  username: string;
  trainingTitle1: string;
  trainingObjective1: string;
  trainingStatus1: string;
  trainingDuration1: string;
  trainingTitle2: string;
  trainingObjective2: string;
  trainingStatus2: string;
  trainingDuration2: string;
  trainingTitle3: string;
  trainingObjective3: string;
  trainingStatus3: string;
  trainingDuration3: string;
}
