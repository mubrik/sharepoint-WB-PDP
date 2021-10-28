import { WebPartContext } from "@microsoft/sp-webpart-base";
import {IServer} from '../controller/serverTypes';

export interface IHRpersonalDevPlanProps {
  description: string;
  context: WebPartContext;
  request: IServer;
}
