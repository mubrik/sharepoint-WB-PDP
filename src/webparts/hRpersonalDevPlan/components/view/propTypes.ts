import {ISPFullObj} from "../../controller/serverTypes";

export interface IViewPageProps {

}

export interface IBaseViewCompProps {
  viewData: ISPFullObj;
  isDataAvail: boolean;
}

export interface IViewStateData {
  data: ISPFullObj;
  status: string;
  isDataAvail: boolean;
}
