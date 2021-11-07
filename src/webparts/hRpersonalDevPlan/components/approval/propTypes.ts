import {ISPFullObj} from "../../controller/serverTypes";
import {IAppData} from "../dataTypes";


export interface IApprovalProps {
  userType: string;
  setAppData: React.Dispatch<React.SetStateAction<IAppData>>;
  setMainPageState: React.Dispatch<React.SetStateAction<string>>;
}

export interface IStateData {
  data: ISPFullObj[];
  status: string;
}
