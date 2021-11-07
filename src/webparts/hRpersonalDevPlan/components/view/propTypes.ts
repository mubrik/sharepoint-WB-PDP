import {ISPFullObj} from "../../controller/serverTypes";
import {IAppData} from "../dataTypes";

export interface IViewPageProps {
  appData: IAppData;
  setAppData: React.Dispatch<React.SetStateAction<IAppData>>;
}

export interface IBaseViewCompProps {
  viewData: ISPFullObj;
  isDataAvail: boolean;
}

export interface ITrainingCompProps extends IBaseViewCompProps {
  appData: IAppData;
  setViewStateData: React.Dispatch<React.SetStateAction<IViewStateData>>;
}

export interface IViewStateData {
  data: ISPFullObj;
  status: string;
  isDataAvail: boolean;
}
