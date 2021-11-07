import { sp } from "@pnp/sp/presets/core";
import "@pnp/sp/webs";
import "@pnp/sp/site-users";
import "@pnp/sp/profiles";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-groups/web";
// types
import { IServer, IPartialSPdata, IUserData,ISPFullObj } from "./serverTypes";
import {IFormYearData, IFormTrainingData, IFormBioData, IFormUserData} from "../components/dataTypes";


/* handler for CRUD REST requests */
class Server implements IServer {

  public fetch = sp;

  public testing = async () => {
    let groups = await sp.web.currentUser.groups();
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
      return new Promise(res => res([])) as Promise<any[]>;
    }
  }

  public getListById = (id: number):Promise<{} | ISPFullObj> => {
    try {
      return this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.getById(id).get();
    } catch (err) {
      console.log(err);
      return new Promise(res => res({})) as Promise<{}>;
    }
  }

  public userDraftExists = (username: string): Promise<boolean> => {

    return new Promise((resolve, _) => {
      // get list
      this.getUserList(username)
      .then(list => {
        if (list.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public getHrList = (username: string) => {

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
    async (userData: IFormUserData, yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData): Promise<boolean> => {
    // partial data
    let _partial = this.processSharepointData(yearData, trainData);
    // mutate
    let _draft = {
      ...userData,
      ...stakeHolderData,
      ..._partial
    };

    console.log(_draft);
    // get list, add item
    return new Promise((resolve, _) => {

      // list and add item
      this.fetch.web.lists.getByTitle("HR-PDP-SINGLE").items.add(_draft)
        .then(res => {
          console.log(res);
          resolve(true);
        })
        .catch(_res => {
          resolve(false);
        });
    });
  }

  public updateEntry = async (id: number, param: object) => {

    let list = this.fetch.web.lists.getByTitle("HR-PDP-SINGLE");

    const i = await list.items.getById(id).update(param);

    console.log(i);
  }

  public deleteEntry = async (id: number): Promise<boolean> =>  {

    return new Promise((resolve, _) => {

      this.fetch.web.lists.getByTitle("HR-PDP-SINGLE")
        .items.getById(id).delete()
        .then(_res => {
          console.log(_res);
          resolve(true);
        })
        .catch(_err => {
          resolve(false);
        });
    });
  }

  public approveRejectEntry = async (id: number, userType: string, param: "approved"|"rejected") => {
    //log
    console.log(id, userType, param);
    // get list
    const list = this.fetch.web.lists.getByTitle("HR-PDP-SINGLE");
    // get date
    const _date = new Date();
    // obj to update
    const updateObj = {};
    // mutate obj
    switch(userType) {
      case "hr" :
        updateObj["hrManagerStatus"] = param;
        updateObj["hrManagerDate"] = _date;
        break;

      case "lineManager" :
        updateObj["lineManagerStatus"] = param;
        updateObj["lineManagerDate"] = _date;
        break;

      case "gc" :
        updateObj["gcioStatus"] = param;
        updateObj["gcioDate"] = _date;
        break;
      default:
        break;
    }
    // update
    const i = await list.items.getById(id).update(updateObj);

    console.log(i);
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
