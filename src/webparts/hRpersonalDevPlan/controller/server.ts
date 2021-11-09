import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// types
import {IServer, ISPBioDataObj, ISPTrainingDataObj} from "./serverTypes";
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
  private noContext = async () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }
  }

  public getUserBioList = async () => {
    this.noContext();

    return this.fetch.web.lists.getByTitle("HR-PDP-TRAINING").items.get();
  }

  public getUserTrainingList = () => {
    this.noContext();

    return this.fetch.web.lists.getByTitle("HR-PDP1").items.select().filter("User eq '" + this.context.pageContext.user.loginName + "'").get();
  }

  public createEntry = (yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData) => {
    // bio data
    this.createBioEntry(stakeHolderData);
    // training
    this.createTrainingEntry(trainData);
    // year
    this.createYearGoalEntry(yearData);
  }

  private createBioEntry = async (param: IFormBioData) => {
    // copy
    let _draft = {
      ...param,
      username: this.context.pageContext.user.loginName,
    };
    // get list, add item
    const result = await this.fetch.web.lists.getByTitle("HR-PDP-BIOS").items.add(_draft);

    console.log(result);
  }

  private createTrainingEntry = async (param: IFormTrainingData) => {
    // copy
    let _draft = {...param};
    console.log("train", _draft);
    // list
    let list = this.fetch.web.lists.getByTitle("HR-PDP-TRAINING");
    // entity name of list needed for batch update
    const entityTypeFullName = await list.getListItemEntityTypeFullName();
    // batch
    let batch = sp.web.createBatch();
    // loop over
    Object.keys(_draft).forEach(_training => {
      list.items.inBatch(batch).add({
        userName: this.context.pageContext.user.loginName,
        trainingTitle: _draft[_training].trainingTitle,
        trainingObjective: _draft[_training].trainingObjective,
        trainingStatus: _draft[_training].trainingStatus,
        trainingDuration: _draft[_training].trainingDuration,
      }, entityTypeFullName)
      .then(b => console.log(b));
    });

    await batch.execute();

  }

  private createYearGoalEntry = async (param: IFormYearData) => {
    // copy
    let _draft = {...param};
    // list
    let list = this.fetch.web.lists.getByTitle("HR-PDP-YEAR");
    // entity name of list needed for batch update
    const entityTypeFullName = await list.getListItemEntityTypeFullName();
    // batch
    let batch = sp.web.createBatch();
    // loop over
    Object.keys(_draft).forEach(_year => {
      list.items.inBatch(batch).add({
        username: this.context.pageContext.user.loginName,
        year: _year,
        yearGoal: _draft[_year]
      }, entityTypeFullName)
      .then(b => console.log(b));
    });

    await batch.execute();
  }
}

export default Server;
