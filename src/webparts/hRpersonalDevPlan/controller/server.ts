import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// types
import { IServer, IPartialSPdata } from "./serverTypes";
import {IFormYearData, IFormTrainingData, IFormBioData} from "../components/dataTypes";

const LIST_COLUMNS = [
  "User", "Week", "Status", "Projects", "Description",
  "Task", "Location", "FreshService", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "Year", "Id"
];

/* handler for CRUD REST requests */
class Server implements IServer {

  public fetch = sp;
  public context: WebPartContext|null;

  public constructor (context:WebPartContext ) {
    this.context = context ? context : null;
  }

  public getUserBioList = async () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }

    return this.fetch.web.lists.getByTitle("HR-PDP-TRAINING").items.get();
  }

  public getUserTrainingList = () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }

    return this.fetch.web.lists.getByTitle("HR-PDP1").items.select().filter("User eq '" + this.context.pageContext.user.loginName + "'").get();
  }

  public createEntry = async (yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData) => {

    // creat partial data
    let _partial = this.processSharepointData(yearData, trainData);
    console.log(_partial);
    // mutate
    let _draft = {
      username: this.context.pageContext.user.loginName,
      ...stakeHolderData,
      ..._partial
    };
    // get list, add item
    const result = await this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.add(_draft);

    console.log(result);

  }

  private processSharepointData = (yearData: IFormYearData, trainData: IFormTrainingData): IPartialSPdata => {
    // state
    let _spData = {};
    // loop over year data
    Object.keys(yearData).forEach((_year, _index) => {
      // number
      let num = _index+1;
      // string
      let year = "year" + num;
      let yearGol = "yearGoal" + num;
      // mutate
      _spData[year] = _year;
      _spData[yearGol] = yearData[_year];
    });
    // loop over training
    Object.keys(trainData).forEach((_training, _index) => {
      // number
      let num = _index+1;
      // string
      let trainTitle = "trainingTitle" + num;
      let trainDuration = "trainingDuration" + num;
      let trainStatus = "trainingStatus" + num;
      let trainObj = "trainingObjective" + num;
      // mutate
      _spData[trainTitle] = trainData[_training].trainingTitle;
      _spData[trainDuration] = trainData[_training].trainingDuration;
      _spData[trainStatus] = trainData[_training].trainingStatus;
      _spData[trainObj] = trainData[_training].trainingObjective;
    });

    return _spData;
  }
}

export default Server;
