import * as React from 'react';
import { IHRpersonalDevPlanProps } from './IHRpersonalDevPlanProps';
// UI
import {Stack} from "office-ui-fabric-react";
// components
import NavBar from "./nav/Navbar";
import NewPage from "./form/NewPage";
import ViewPage from "./view/ViewPage";
import ApprovalPage from "./approval/ApprovalPage";
import ErrorBoundary from "./error/ErrorBoundary";
import UserContext from './userContext/UserContext';
import NotificationContext from "./notification/NotificationBarContext";
import {useNotification} from "./notification/NotificationBarContext";
import AboutPage from "./about/AboutPage";
// types
import {IUserData} from "../controller/serverTypes";
import {fetchServer} from "../controller/server";
import {initialAppData, IAppData} from "./dataTypes";

// context for user data
// export const UserContext = React.createContext<IUserData>(null);
export const AppContext = React.createContext<IAppData>(null);

// main component
const MainPage:React.FunctionComponent<IHRpersonalDevPlanProps> = () => {

  // page state
  const [pageState, setPageState] = React.useState("plan");
  const [userData, setUserData] = React.useState<IUserData>({});
  const [appData, setAppData] = React.useState<IAppData>(initialAppData);

  // webpart width
  React.useEffect(() => {
    try {
      document.getElementById("workbenchPageContent").style.maxWidth = "1920px";
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  // effect for app data segtting
  React.useEffect(() => {
    if ("email" in userData) {
      // get
      fetchServer.userDraftExists(userData.email)
        .then(result => setAppData(prevValue => ({
          ...prevValue,
          draftAvailable: result
        })));
    }
  }, [userData]);

  return (
    <ErrorBoundary>
    <NotificationContext>
    <UserContext>
      <Stack tokens={{ childrenGap: 8 }}>
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
          pageState === "about" &&
          <AboutPage/>
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
      </Stack>
    </UserContext>
    </NotificationContext>
    </ErrorBoundary>
  );
};

export default MainPage;
