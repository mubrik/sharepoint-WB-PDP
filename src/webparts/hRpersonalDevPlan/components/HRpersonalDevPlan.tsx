import * as React from 'react';
import { IHRpersonalDevPlanProps } from './IHRpersonalDevPlanProps';
// UI
import {Stack} from "office-ui-fabric-react";
// components
import NavBar from "./nav/Navbar";
import NewPage from "./form/NewPage";
import ViewPage from "./view/ViewPage";
import ApprovalPage from "./approval/ApprovalPage";
// types
import {IUserData} from "../controller/serverTypes";
import {fetchServer} from "../controller/server";
import {initialAppData, IAppData} from "./dataTypes";

// context for user data
export const UserContext = React.createContext(null);
export const AppContext = React.createContext(null);

// main component
const MainPage:React.FunctionComponent<IHRpersonalDevPlanProps> = () => {

  // page state
  const [pageState, setPageState] = React.useState("new");
  const [userData, setUserData] = React.useState<IUserData>({ok: false});
  const [appData, setAppData] = React.useState<IAppData>(initialAppData);

  // webpart width
  React.useEffect(() => {
    try {
      document.getElementById("workbenchPageContent").style.maxWidth = "1920px";
    } catch (error) {

    }
  }, []);
  // get user data
  React.useEffect(() => {
    // server fetch
    fetchServer.getUser()
    .then(res => {
      // if successful
      if (res.ok) {
        setUserData({
          ...res
        });
      }
    });
  }, []);
  // effect for app data segtting
  React.useEffect(() => {
    if (userData.ok) {
      // get
      fetchServer.userDraftExists(userData.email)
        .then(result => setAppData(prevValue => ({
          ...prevValue,
          draftAvailable: result
        })));
    }
  }, [userData]);

  return (
    <Stack>
    <UserContext.Provider value={userData}>
      <NavBar pageState={pageState} setPageState={setPageState}/>
      {
        pageState === "new" &&
        <NewPage
          appData={appData}
          setAppData={setAppData}
        />
      }
      {
        pageState === "plan" &&
        <ViewPage
          appData={appData}
          setAppData={setAppData}
        />
      }
      {
        pageState === "hr" &&
        <ApprovalPage
          userType={"hr"}
          setAppData={setAppData}
          setMainPageState={setPageState}
        />
      }
      {
        pageState === "lineManager" &&
        <ApprovalPage
          userType={"lineManager"}
          setAppData={setAppData}
          setMainPageState={setPageState}
        />
      }
      {
        pageState === "gc" &&
        <ApprovalPage
          userType={"gc"}
          setAppData={setAppData}
          setMainPageState={setPageState}
        />
      }
    </UserContext.Provider>
    </Stack>
  );
};

export default MainPage;
