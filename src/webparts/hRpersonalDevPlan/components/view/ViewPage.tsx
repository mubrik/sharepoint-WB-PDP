import * as React from "react";
import {Stack,
  PrimaryButton
} from "office-ui-fabric-react";
// contexts
import { useUserData } from "../userContext/UserContext";
import { useAppSettings } from "../appSetting/AppSettingContext";
import { useDialog } from "../dialog/DialogContext";
// types
import { ISPFullObj } from "../../types/custom";
// server
import {fetchServer} from "../../controller/server";
// components
import YearView from "./YearView";
import TrainingView from "./TrainingView";
import BioView from "./BioView";
// notification
import {useNotification} from "../notification/NotificationBarContext";

type viewPageStatus = "idle" | "loaded" | "loading" | "empty" |"error";

const ViewPage = ():JSX.Element => {

  // states
  const [stateData, setStateData] = React.useState<ISPFullObj>({} as ISPFullObj);
  const [loadingStatus, setLoadingStatus] = React.useState<viewPageStatus>("idle");

  // userdata
  const { email } = useUserData();
  // app settings
  const { viewPageMode, linkedItemId, setAppSettings } = useAppSettings();
  // dialog
  const dialog = useDialog();
  // notify
  const setNotification = useNotification();

  // use effect for getting data
  React.useEffect(() => {
    // if already loaded/ email null
    if (loadingStatus === "loaded" || !email) {
      return;
    }
    // get user data
    if (viewPageMode === "normal") {
      fetchServer.getUserList(email)
        .then(result => {
          if (result.length === 0) {
            // update app setting
            setAppSettings(prevValue => ({
              ...prevValue,
              draftAvailable: false
            }));
          } else {
            setStateData(prevValue => ({
              ...prevValue,
              ...result[0],
            }));
            // update app setting
            setAppSettings(prevValue => ({
              ...prevValue,
              draftAvailable: true
            }));
          }
        })
        .then(() => setLoadingStatus("loaded"))
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error getting data, try again", errorObj: error});
          setLoadingStatus("error");
        });
    } else {
      fetchServer.getListById(linkedItemId)
        .then(result => {
          setStateData({...result});
          setLoadingStatus("loaded");
        })
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error getting data, try again", errorObj: error});
          setLoadingStatus("error");
        });
    }
  }, [loadingStatus, viewPageMode, email]);

  // effect to handle unmounting, run only once
  React.useEffect(() => {
    // unmounting func
    return () => {
      // if page mode is linked, set to nomal when unmounting
      if (viewPageMode === "linked") {
        setAppSettings(prevValue => ({
          ...prevValue,
          viewPageMode: "normal"
        }));
      }
    };
  }, []);
  // handlers
  const handleDeleteClick = (): void => {

    if (stateData.Id) {
      // delete entry
      fetchServer.deleteEntry(stateData.Id)
        .then(res => {
          if (res) {
            // update state if delete successful
            setStateData({});
            setLoadingStatus("idle");
            setNotification({show: true, isError: false, msg: "Draft deleted"});
          }
        })
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error deleting item", errorObj: error});
        });
    }
  };

  return (
    <Stack tokens={{childrenGap: 10}}>
      {
        loadingStatus === "idle" &&
        <div>
          Loading data ...
        </div>
      }
      {
        (loadingStatus === "loaded" && stateData.Id === undefined) &&
        <div>
          No data... Create a new personal development plan
        </div>
      }
      {
        (loadingStatus === "loaded" && stateData.Id !== undefined) &&
        <>
          <YearView
            viewData={stateData}
          />
          <BioView
            viewData={stateData}
          />
          <TrainingView
            viewData={stateData}
            setViewStateData={setStateData}
          />
          {
            viewPageMode === "normal" &&
            <PrimaryButton
              text={"Delete Current Plan"}
              onClick={() => {
                dialog({
                  show: true,
                  msg: "Delete Current plan?",
                  onAccept: handleDeleteClick,
                  type: "normal",
                  buttonText: "Delete"
                });
              }}
            />
          }
        </>
      }
    </Stack>
  );
};

export default ViewPage;
