import {ISPFullObj} from "../../controller/serverTypes";


export interface IApprovalProps {
  userType: string;
}

export interface IStateData {
  data: ISPFullObj[];
  status: string;
}
