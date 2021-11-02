import { sp } from "@pnp/sp/presets/core";
import "@pnp/sp/webs";
import "@pnp/sp/site-users";
import "@pnp/sp/profiles";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-groups/web";
// types
import { IServer, IPartialSPdata, IUserData } from "./serverTypes";
import {IFormYearData, IFormTrainingData, IFormBioData, IFormUserData} from "../components/dataTypes";

// const LIST_COLUMNS = [
//   "User", "Week", "Status", "Projects", "Description",
//   "Task", "Location", "FreshService", "Monday", "Tuesday",
//   "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
//   "Year", "Id"
// ];

/* handler for CRUD REST requests */
class Server implements IServer {

  public fetch = sp;

  public testing = async () => {
    let groups = await sp.web.currentUser.groups();
    // arr
    // let grpArr: string[] = [];
    // // loop groups
    // groups.forEach(grpObj => grpArr.push(grpObj.Title));
    // // vars
    // let isUserHr = grpArr.includes("HR Approvers");
    // let isUserManager = grpArr.includes("LineManagers Approvers");
    // let isUserGroupHead = grpArr.includes("GroupHeads Approvers");
    //
    // const userProf = {
    //   isUserHr,
    //   isUserManager,
    //   isUserGroupHead
    // };

    //get user object by Email
    // const user = await sp.web.siteUsers();
    // const user = await sp.web.siteUsers.getByEmail("Angela.Selekere@DANGOTE.COM").get();

    console.log(groups);
  }

  public getUser = async ():Promise<IUserData> => {

    try {
      // get profile, user and groups
      const profile = await this.fetch.profiles.myProperties.get();
      let user = await this.fetch.web.currentUser();
      let groups = await sp.web.currentUser.groups();
      // vars
      let managersArr: string[] = profile.ExtendedManagers;
      let manager = "";
      // for fse
      if (profile.Title === "Field Support Engineer") {
        // 2nd item to skip first
        const managerLogName = managersArr[managersArr.length - 2];
        // get profile
        const managerProfile = await sp.profiles.getPropertiesFor(managerLogName);
        // last string is manager
        manager = managerProfile.Email;
      } else {
        const managerLogName = managersArr[managersArr.length - 1];
        // get profile
        const managerProfile = await sp.profiles.getPropertiesFor(managerLogName);
        // manager email
        manager = managerProfile.Email;
      }
      // groups
      // arr
      let grpArr: string[] = [];
      // loop groups
      groups.forEach(grpObj => grpArr.push(grpObj.Title));
      // vars
      let isUserHr = grpArr.includes("HR Approvers");
      let isUserManager = grpArr.includes("LineManagers Approvers");
      let isUserGroupHead = grpArr.includes("GroupHeads Approvers");

      // return
      return {
        ok: true,
        id: user.Id,
        email: profile.Email,
        displayName: profile.DisplayName,
        manager: manager,
        jobTitle: profile.Title,
        isUserHr,
        isUserManager,
        isUserGroupHead
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false
      };
    }
  }

  public getUserList = (username: string) => {
    try {
      return this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.select().filter("username eq '" + username + "'").get();
    } catch (err) {
      console.log(err);
    }
  }

  public getHrList = (username: string) => {
    console.log("hr", username);
    try {
      return this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.select().filter("hrManager eq '" + username + "'").get();
    } catch (err) {
      console.log(err);
    }
  }

  public getLineManagerList = (username: string) => {
    try {
      return this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.select().filter("lineManager eq '" + username + "'").get();
    } catch (err) {
      console.log(err);
    }
  }

  public getGroupHeadList = (username: string) => {
    try {
      return this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.select().filter("gcio eq '" + username + "'").get();
    } catch (err) {
      console.log(err);
    }
  }

  public createEntry =
    async (userData: IFormUserData, yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData) => {

    // creat partial data
    console.log(userData);

    let _partial = this.processSharepointData(yearData, trainData);
    // mutate
    let _draft = {
      ...userData,
      ...stakeHolderData,
      ..._partial
    };

    console.log(_draft);
    // get list, add item
    const result = await this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.add(_draft);

    console.log(result);

  }

  private processSharepointData = (yearData: IFormYearData, trainData: IFormTrainingData): IPartialSPdata => {
    // state
    let _spData = {
      "yearsTotal": Object.keys(yearData).length + "",
      "trainingTotal": Object.keys(trainData).length + ""
    };
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

const fetchServer = new Server();

export {fetchServer};
