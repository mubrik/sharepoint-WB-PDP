import * as React from "react";
import {Stack,
  PrimaryButton
} from "office-ui-fabric-react";
// contexts
import {UserContext} from "../HRpersonalDevPlan";
// types
import {IViewStateData, IViewPageProps} from "./propTypes";
import {fetchServer} from "../../controller/server";
import {IUserData} from "../../controller/serverTypes";
// components
import YearView from "./YearView";
import TrainingView from "./TrainingView";
import BioView from "./BioView";
import DialogOption from '../utils/DialogOption';
// notification
import useNotificationHook from "../notification/hook";

const initialViewStateData: IViewStateData = {
  data: {},
  isDataAvail: false,
  status: "idle"
};

const ViewPage = ({appData, setAppData}: IViewPageProps):JSX.Element => {
  // server req context
  const userData:IUserData = React.useContext(UserContext);
  // states
  const [stateData, setStateData] = React.useState(initialViewStateData);
  const [dialogProps, setDialogProps] = React.useState({
    show: false,
    title: "",
    subtitle: "",
    callback: () => {},
    dtype: "close"
  });
  // notify
  const setNotification = useNotificationHook();

  // use effect for getting data
  React.useEffect(() => {
    if (stateData.status === "loaded") {
      return;
    }
    // get user data
    if (appData.viewPageMode === "normal") {
      fetchServer.getUserList(userData.email)
        .then(result => {
          if (result.length === 0) {
            // empty array, user not created
            setStateData(prevValue => ({
              ...prevValue,
              isDataAvail: false,
              status: "loaded"
            }));
            // update app setting
            setAppData(prevValue => ({
              ...prevValue,
              draftAvailable: false
            }));
          } else {
            setStateData(prevValue => ({
              ...prevValue,
              data: {...result[0]},
              isDataAvail: true,
              status: "loaded"
            }));
            // update app setting
            setAppData(prevValue => ({
              ...prevValue,
              draftAvailable: true
            }));
          }
        })
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error getting data, try again", errorObj: error});
        });
    } else {
      fetchServer.getListById(appData.linkedItemId)
        .then(result => {
          setStateData(prevValue => ({
            ...prevValue,
            data: {...result},
            isDataAvail: true,
            status: "loaded"
          }));
        })
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error getting data, try again", errorObj: error});
        });
    }
  }, [stateData.status, appData.viewPageMode]);

  // effect to handle unmounting, run only once
  React.useEffect(() => {
    // unmounting func
    return () => {
      // if page mode is linked, set to nomal when unmounting
      if (appData.viewPageMode === "linked") {
        setAppData(prevValue => ({
          ...prevValue,
          viewPageMode: "normal"
        }));
      }
    };
  }, []);
  // handlers
  const handleDeleteClick = () => {
    // delete entry
    fetchServer.deleteEntry(stateData.data.Id)
      .then(res => {
        if (res) {
          // update state if delete successful
          setStateData({
            data: {},
            isDataAvail: false,
            status: "idle"
          });
          setNotification({show: true, isError: false, msg:"Draft deleted"});
        }
      })
      .catch(error => {
        setNotification({show: true, isError: true, msg:"Error deleting item", errorObj: error});
      });
  };

  return (
    <Stack tokens={{childrenGap: 10}}>
      {
        stateData.status === "idle" &&
        <div>
          Loading data ...
        </div>
      }
      {
        stateData.status === "loaded" && !stateData.isDataAvail &&
        <div>
          No data... Create a new personal development plan
        </div>
      }
      {
        stateData.status === "loaded" && stateData.isDataAvail &&
        <>
          <YearView
            viewData={stateData.data}
            isDataAvail={stateData.isDataAvail}
          />
          <BioView
            viewData={stateData.data}
            isDataAvail={stateData.isDataAvail}
          />
          <TrainingView
            viewData={stateData.data}
            appData={appData}
            isDataAvail={stateData.isDataAvail}
            setViewStateData={setStateData}
          />
          {
            appData.viewPageMode === "normal" &&
            <PrimaryButton
              text={"Delete Current Plan"}
              onClick={() => {
                setDialogProps({
                  show: true,
                  title: "Delete?",
                  subtitle: "This cannot be undone",
                  callback: handleDeleteClick,
                  dtype: "close"
                });
              }}
            />
          }
          <DialogOption
            {...dialogProps}
            setDialogProps={setDialogProps}
          />
        </>
      }
    </Stack>
  );
};

export default ViewPage;
