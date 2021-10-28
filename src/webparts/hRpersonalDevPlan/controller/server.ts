import { sp } from "@pnp/sp/presets/core";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// types
import {IServer} from "./serverTypes";

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

    return this.fetch.web.lists.getByTitle("PDP1").items.select().filter("User eq '" + this.context.pageContext.user.loginName + "'").get();
  }

  public getUserTrainingList = () => {
    if (!this.context) {
      return new Promise(res => {
        res([]);
      }) as Promise<[]>;
    }

    return this.fetch.web.lists.getByTitle("PDP2").items.select().filter("User eq '" + this.context.pageContext.user.loginName + "'").get();
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
