
export const initialBioFormData = {
  strengthWeakness: "",
  stakeHolder1: "",
  stakeHolder2: "",
  stakeHolder3: "",
};

export const initialTrainingFormData = {
  trainingTitle: "",
  trainingStatus: "",
  trainingDuration: "",
  trainingObjective: ""
};

// validation obj
export const initialValidObj = {
  bioData: {valid:false, msg: ""},
  yearData: {valid:false, msg: ""},
  trainData: {valid:false, msg: ""},
  state: {valid: false, msg: ""}
};

export interface IValidState {
  bioData: IValidationObj;
  yearData: IValidationObj;
  trainData: IValidationObj;
  state: IValidationObj;
}

export interface IValidationObj {
  valid: boolean;
  msg: string;
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
  stakeHolder3: string;
  strengthWeakness: string;
  // continousImprovement: string;
  // stepsTaken: string;
}

// interface for single training data
export interface ISingleTrainingData {
  trainingTitle: string;
  trainingObjective: string;
  trainingStatus: string;
  trainingDuration: string;
}
