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
import ErrorModal from "./error/ErrorModal";
import {ErrorModalContext} from "./error/ErrorModal";
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
  // context
  const setErrorState = React.useContext(ErrorModalContext);

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
    .then(result => {
      setUserData({
        ...result
      });
    })
    .catch(error => {
      setErrorState({hasError: true, errorMsg:"Error getting data, Network?", errorObj: error});
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
    <ErrorBoundary>
    <ErrorModal>
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
    </ErrorModal>
    </ErrorBoundary>
  );
};

export default MainPage;
