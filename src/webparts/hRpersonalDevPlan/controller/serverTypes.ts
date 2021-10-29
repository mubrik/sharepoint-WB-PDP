import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {IFormYearData, IFormTrainingData, IFormBioData} from "../components/dataTypes";

/* interface */
export interface IServer {
  fetch: typeof sp;
  context: WebPartContext|null;
  getUserBioList: () => Promise<any[]| ISPBioDataObj[]>;
  getUserTrainingList: () => Promise<any[]| ISPTrainingDataObj[]>;
  createEntry: (yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData) => void;
}

export interface ISPBioDataObj {
  username: string;
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

export interface ISPYearGoalsObj{
  username: string;
  year: string;
  yearGoal: string;
}
