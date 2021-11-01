import * as React from "react";
import {Stack} from "office-ui-fabric-react";
// contexts
import {UserContext} from "../HRpersonalDevPlan";
// types
import {IViewStateData} from "./propTypes";
import {fetchServer} from "../../controller/server";
import {IUserData} from "../../controller/serverTypes";
// components
import YearView from "./YearView";
import TrainingView from "./TrainingView";
import BioView from "./BioView";

const initialViewStateData: IViewStateData = {
  data: {},
  isDataAvail: false,
  status: "idle"
};

const ViewPage = ():JSX.Element => {
  // server req context
  const userData:IUserData = React.useContext(UserContext);
  // states
  const [stateData, setStateData] = React.useState(initialViewStateData);
  // const [viewMode, setViewMode] = React.useState(true);
  // use effect for getting data
  React.useEffect(() => {
    // get user data
    fetchServer.getUserList(userData.email)
      .then(result => {
        console.log(result);
        if (result.length === 0) {
          // empty array, user not created
          setStateData(prevValue => ({
            ...prevValue,
            isDataAvail: false,
            status: "loaded"
          }));
        } else {
          setStateData(prevValue => ({
            ...prevValue,
            data: {...result[0]},
            isDataAvail: true,
            status: "loaded"
          }));
        }
      })
      .catch(err => console.log(err));

  }, []);

  return (
    <Stack>
      {
        stateData.status === "idle" &&
        <div>
          loading data ...
        </div>
      }
      {
        stateData.status === "loaded" && !stateData.isDataAvail &&
        <div>
          no data... create new personal dev plan
        </div>
      }
      {
        stateData.status === "loaded" && stateData.isDataAvail &&
        <>
          <YearView
            viewData={stateData.data}
            isDataAvail={stateData.isDataAvail}
          />
          <TrainingView
            viewData={stateData.data}
            isDataAvail={stateData.isDataAvail}
          />
          <BioView
            viewData={stateData.data}
            isDataAvail={stateData.isDataAvail}
          />
        </>
      }
    </Stack>
  );
};

export default ViewPage;
