import {IFormTrainingData, IFormYearData, IFormBioData, IValidState, IValidationObj} from "../dataTypes";

export const initialValidObj = {
  bioData: {valid:false, msg: ""},
  yearData: {valid:false, msg: ""},
  trainData: {valid:false, msg: ""},
  state: {valid: false, msg: ""}
};

export interface IBaseInputProps {
  validState: IValidationObj;
  setValidState: React.Dispatch<React.SetStateAction<IValidState>>;
}

export interface IBioControlProps extends IBaseInputProps {
  bioData: IFormBioData;
  _onChange: (name: string, event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
}

export interface ITrainingControlProps extends IBaseInputProps {
  trainData: IFormTrainingData;
  setTrainData: React.Dispatch<React.SetStateAction<IFormTrainingData>>;
}

export interface IYearControlProps extends IBaseInputProps {
  yearData: IFormYearData;
  setYearData: React.Dispatch<React.SetStateAction<IFormYearData>>;
}

export interface IInputControlProps extends IBaseInputProps {
  trainData: IFormTrainingData;
  yearData: IFormYearData;
  bioData: IFormBioData;
  pageState: number;
  setPageState: React.Dispatch<React.SetStateAction<number>>;
}
