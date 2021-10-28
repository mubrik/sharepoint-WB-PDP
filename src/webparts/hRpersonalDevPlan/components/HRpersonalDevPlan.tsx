import * as React from 'react';
import { IHRpersonalDevPlanProps } from './IHRpersonalDevPlanProps';
// UI
import {Stack} from "office-ui-fabric-react";
// components
import NavBar from "./nav/Navbar";
import NewPage from "./form/NewPage";

// rest request server pageContext
export const RequestContext = React.createContext(null);

// main component
const MainPage:React.FunctionComponent<IHRpersonalDevPlanProps> = (props:IHRpersonalDevPlanProps) => {

  // page state
  const [pageState, setPageState] = React.useState("new");

  // webpart width
  React.useEffect(() => {
    try {
      document.getElementById("workbenchPageContent").style.maxWidth = "1920px";
    } catch (error) {

    }
  }, []);

  return (
    <Stack>
    <RequestContext.Provider value={props.request}>
      <NavBar pageState={pageState} setPageState={setPageState}/>
      {
        pageState === "new" &&
        <NewPage/>
      }
      {
        pageState === "plan" &&
        <div style={{background: "red"}}>
        {props.description}
        </div>
      }
    </RequestContext.Provider>
    </Stack>
  );
};

export default MainPage;
