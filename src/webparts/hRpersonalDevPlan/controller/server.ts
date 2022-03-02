import { IList, sp } from "@pnp/sp/presets/core";
import "@pnp/sp/webs";
import "@pnp/sp/site-users";
import "@pnp/sp/profiles";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
// types
import { IServer, IUserData, ISPFullObj} from "./serverTypes";
import {IFormYearData, IFormTrainingData, IFormBioData, IFormUserData} from "../components/dataTypes";


/* handler for CRUD REST requests */
class Server implements IServer{

  public fetch = sp;
  private planList: IList;

  public constructor () {
    this.planList = this.fetch.web.lists.getByTitle("HR-PDP-SINGLE");
  }

  public testing = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log("lets throw an error");
      throw new Error("fake error");
    });
  }

  public getUser = async ():Promise<IUserData> => {

    try {
      const userDetails = 
        await Promise.allSettled([
          this.fetch.profiles.myProperties.get(),
          this.fetch.web.currentUser(),
          this.fetch.web.currentUser.groups()
        ]);
      // error check
      userDetails.forEach((promise) => {
          // if promisee not fulfiled throw error
          if (promise.status === "rejected") {
            throw new Error("Error getting user data, refresh or contact IT");
          }
        });
      // destructure
      // const [{value: profileData}, {value: userData}, {value: groupData}] = 
      //   userDetails;
      // somehow, typescript doesnt figure out the promise is fufilled after error check
      // typescript issue 42012 on github, i'll keep this here for now in case it gets updated, but imlement differently

      const [_profile, _user, _groups] = userDetails;

      const profile = _profile.status === "fulfilled" ? _profile.value : null;
      const user = _user.status === "fulfilled" ? _user.value : null;
      const groups = _groups.status === "fulfilled" ? _groups.value : null;
      
      // vars
      const managersArr: string[] = profile.ExtendedManagers;
      let manager = "";

      // for fse
      if (profile.Title === "Field Support Engineer") {
        // 2nd item to skip first
        const managerLogName = managersArr[managersArr.length - 2];
        // get managers profile
        const managerProfile = await this.fetch.profiles.getPropertiesFor(managerLogName);
        // store email
        manager = managerProfile.Email;
      } else {
        const managerLogName = managersArr[managersArr.length - 1];
        // get managers profile
        const managerProfile = await this.fetch.profiles.getPropertiesFor(managerLogName);
        // store email
        manager = managerProfile.Email;
      }

      // groups
      // arr
      const grpArr: string[] = [];
      // loop groups
      groups.forEach(grpObj => grpArr.push(grpObj.Title));
      // vars
      const isUserHr = grpArr.includes("HR Approvers");
      const isUserManager = grpArr.includes("LineManagers Approvers");
      const isUserGroupHead = grpArr.includes("GroupHeads Approvers");

      // return
      return {
        id: user.Id,
        email: profile.Email,
        displayName: profile.DisplayName,
        manager: manager,
        jobTitle: profile.Title,
        isUserHr,
        isUserManager,
        isUserGroupHead
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public getUserList = (username: string): Promise<ISPFullObj[]> => {
    // async
    return new Promise((resolve, reject) => {
      this.planList.items.select()
        .filter("username eq '" + username + "'").get()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getListById = (id: number): Promise<ISPFullObj> => {
    // async
    return new Promise((resolve, reject) => {
      this.planList.items.select()
        .getById(id).get()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public userDraftExists = (username: string): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      // get list
      this.getUserList(username)
      .then(list => {
        if (list.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  public getHrList = (username: string): Promise<ISPFullObj[]> => {

    return new Promise((resolve, reject) => {
      this.planList.items.select()
        .filter("hrManager eq '" + username + "'").get()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getLineManagerList = (username: string): Promise<ISPFullObj[]>  => {

    return new Promise((resolve, reject) => {
      this.planList.items.select()
        .filter("lineManager eq '" + username + "'").get()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getGroupHeadList = (username: string): Promise<ISPFullObj[]>  => {

    return new Promise((resolve, reject) => {
      this.planList.items.select()
        .filter("gcio eq '" + username + "'").get()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public createEntry =
    (userData: IFormUserData, yearData: IFormYearData, trainData: IFormTrainingData, stakeHolderData: IFormBioData): Promise<boolean> => {

    // get list, add item
    return new Promise((resolve, reject) => {
      // partial data
      const _partial = this.processSharepointData(yearData, trainData);
      // mutate
      const _draft: ISPFullObj = {
        ...userData,
        ...stakeHolderData,
        ..._partial
      };

      console.log(_draft);
      // error checking
      if (typeof userData.username === "undefined") {
        reject(new Error("username isnt available"));
      }
      // list and add item
      this.planList.items.add(_draft)
        .then(res => {
          console.log(res);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public updateEntry = (id: number, param: Record<string, unknown>): Promise<boolean>  => {

    return new Promise((resolve, reject) => {

      this.planList.items.getById(id).update(param)
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });

  }

  public deleteEntry = (id: number): Promise<boolean> =>  {

    return new Promise((resolve, reject) => {

      this.planList.items.getById(id).delete()
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public approveRejectEntry =
    async (id: number, userType: string, param: "Approved"|"Rejected"): Promise<boolean> => {

    return new Promise((resolve, reject) => {
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

      this.planList.items.getById(id).update(updateObj)
        .then(_ => {
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });

  }

  public sendFeedback = (email: string, rating: number, feedback: string): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      // split string
      const domain = email.split("@")[1];
      // construct mail
      const To = [`webpartfeedback@${domain}`];
      const Subject = `Feedback from ${email}`;
      const Body = `Rated: ${rating} stars, Feedback: ${feedback}`;
      // body
      const emailProps: IEmailProperties = {
        To,
        Subject,
        Body
      };
      console.log(emailProps);
      // send
      this.fetch.utility.sendEmail(emailProps)
        .then(_ => resolve(true))
        .catch(error => reject(error));
    });
  }

  private processSharepointData = (yearData: IFormYearData, trainData: IFormTrainingData): Record<string, string|number> => {
    // state
    const _spData = {
      "yearsTotal": Object.keys(yearData).length,
      "trainingTotal": Object.keys(trainData).length
    };
    // loop over year data
    Object.keys(yearData).forEach((_year, _index) => {
      // number
      const num = _index+1;
      // string
      const year = "year" + num;
      const yearGol = "yearGoal" + num;
      // mutate
      _spData[year] = _year;
      _spData[yearGol] = yearData[_year];
    });
    // loop over training
    Object.keys(trainData).forEach((_training, _index) => {
      // number
      const num = _index+1;
      // string
      const trainTitle = "trainingTitle" + num;
      const trainDuration = "trainingDuration" + num;
      const trainStatus = "trainingStatus" + num;
      const trainObj = "trainingObjective" + num;
      // mutate
      _spData[trainTitle] = trainData[_training].trainingTitle;
      _spData[trainDuration] = trainData[_training].trainingDuration;
      _spData[trainStatus] = Number(trainData[_training].trainingStatus);
      _spData[trainObj] = trainData[_training].trainingObjective;
    });

    return _spData;
  }
}

const fetchServer = new Server();

export {fetchServer};
