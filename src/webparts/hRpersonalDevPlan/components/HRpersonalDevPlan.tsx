import * as React from 'react';
import { IHRpersonalDevPlanProps } from './IHRpersonalDevPlanProps';
// UI
import {Stack} from "office-ui-fabric-react";
// components
import NavBar from "./nav/Navbar";
import NewPage from "./form/NewPage";
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
    </Stack>
  );
};

export default MainPage;
