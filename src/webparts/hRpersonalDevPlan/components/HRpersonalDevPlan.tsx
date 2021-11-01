import * as React from 'react';
import { IHRpersonalDevPlanProps } from './IHRpersonalDevPlanProps';
// UI
import {Stack} from "office-ui-fabric-react";
// components
import NavBar from "./nav/Navbar";
import NewPage from "./form/NewPage";
import ViewPage from "./view/ViewPage";
// types
import {IUserData} from "../controller/serverTypes";
import {fetchServer} from "../controller/server";

// context for user data
export const UserContext = React.createContext(null);

// main component
const MainPage:React.FunctionComponent<IHRpersonalDevPlanProps> = () => {

  // page state
  const [pageState, setPageState] = React.useState("new");
  const [userData, setUserData] = React.useState<IUserData>({ok: false});

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

  return (
    <Stack>
    <UserContext.Provider value={userData}>
      <NavBar pageState={pageState} setPageState={setPageState}/>
      {
        pageState === "new" &&
        <NewPage/>
      }
      {
        pageState === "plan" &&
        <ViewPage/>
      }
    </UserContext.Provider>
    </Stack>
  );
};

export default MainPage;
