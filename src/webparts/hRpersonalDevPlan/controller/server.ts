import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// types
import {IServer, ISPBioDataObj, ISPTrainingDataObj} from "./serverTypes";
import {initialFormData} from "../initialDataTypes";

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

  public getUserBioList = () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }
    console.log(this.context);
    console.log(this.fetch);

    return this.fetch.web.lists.getByTitle("B4").items.get();
  }

  public getUserTrainingList = () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }

    return this.fetch.web.lists.getByTitle("HR-PDP1").items.select().filter("User eq '" + this.context.pageContext.user.loginName + "'").get();
  }

  public createEntry = (param: typeof initialFormData) => {
    // copy
    let _draft = {...param};
    // create bio data
    this.createBioData({
      username: this.context.pageContext.user.loginName,
      year1: _draft.year1,
      year2: _draft.year2,
      year3: _draft.year3,
      stakeHolder1: _draft.stakeHolder1,
      stakeHolder2: _draft.stakeHolder2,
      strengthWeakness: _draft.strengthWeakness,
      stepsTaken: _draft.stepsTaken,
      continousImprovement: _draft.continousImprovement
    });

    this.createTrainingData({
      username: this.context.pageContext.user.loginName,
      trainingTitle1: _draft.trainingTitle1,
      trainingObjective1: _draft.trainingObjective1,
      trainingStatus1: _draft.trainingStatus1,
      trainingDuration1: _draft.trainingDuration1,
      trainingTitle2: _draft.trainingTitle2,
      trainingObjective2: _draft.trainingObjective2,
      trainingStatus2: _draft.trainingStatus2,
      trainingDuration2: _draft.trainingDuration2,
      trainingTitle3: _draft.trainingTitle3,
      trainingObjective3: _draft.trainingObjective3,
      trainingStatus3: _draft.trainingStatus3,
      trainingDuration3: _draft.trainingDuration3,
    });
  }

  private createBioData = async (param: ISPBioDataObj) => {
    // get list, add item
    const result = await this.fetch.web.lists.getByTitle("HR-PDP1").items.add(param);

    console.log(result);
  }

  private createTrainingData = async (param: ISPTrainingDataObj) => {
    // get list, add item
    const result = await this.fetch.web.lists.getByTitle("HR-PDP2").items.add(param);

    console.log(result);
  }

  // public createDraft = async (param: IServerReqObject) => {
  //   // slice
  //   let _draft = {...param};
  //   // get list
  //   let list = this.fetch.web.lists.getByTitle("B4");
  //
  //   const entityTypeFullName = await list.getListItemEntityTypeFullName();
  //   // batch
  //   let batch = sp.web.createBatch();
  //   // iterate
  //   _draft.data.forEach((weekData => {
  //     list.items.inBatch(batch).add({
  //       User: this.context.pageContext.user.loginName,
  //       Projects: weekData.project,
  //       Description: weekData.description,
  //       FreshService: weekData.freshService,
  //       Location: weekData.location,
  //       Status: "draft",
  //       Task: weekData.task,
  //       Year: _draft.year.toString(),
  //       Week: _draft.week.toString(),
  //       Monday: weekData.monday,
  //       Tuesday: weekData.tuesday,
  //       Wednesday: weekData.wednesday,
  //       Thursday: weekData.thursday,
  //       Friday: weekData.friday,
  //       Saturday: weekData.saturday,
  //       Sunday: weekData.sunday,
  //     }, entityTypeFullName)
  //     .then(b => console.log(b));
  //   }));
  //
  //   await batch.execute();
  //
  //   console.log("Done");
  // }
  //
  // public updateDraft = async (param: IServerReqObject, id: number) => {
  //   // slice
  //   let _draft = {...param};
  //   // get list
  //   let list = this.fetch.web.lists.getByTitle("B4");
  //
  //   const entityTypeFullName = await list.getListItemEntityTypeFullName();
  //   // batch
  //   let batch = sp.web.createBatch();
  //   // iterate
  //   _draft.data.forEach((weekData => {
  //     list.items.getById(id).inBatch(batch).update({
  //       User: this.context.pageContext.user.loginName,
  //       Projects: weekData.project,
  //       Description: weekData.description,
  //       FreshService: weekData.freshService,
  //       Location: weekData.location,
  //       Status: "draft",
  //       Task: weekData.task,
  //       Year: _draft.year.toString(),
  //       Week: _draft.week.toString(),
  //       Monday: weekData.monday,
  //       Tuesday: weekData.tuesday,
  //       Wednesday: weekData.wednesday,
  //       Thursday: weekData.thursday,
  //       Friday: weekData.friday,
  //       Saturday: weekData.saturday,
  //       Sunday: weekData.sunday,
  //     }, entityTypeFullName)
  //     .then(b => console.log(b));
  //   }));
  //
  //   await batch.execute();
  //
  //   console.log("Done");
  // }
}

export default Server;
