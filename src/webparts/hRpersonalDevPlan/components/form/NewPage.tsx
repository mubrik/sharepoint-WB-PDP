import * as React from "react";
// fabric ui
import {
   Stack,
   Label, PrimaryButton,
 } from "office-ui-fabric-react";
// server
import {fetchServer} from "../../controller/server";
import {IUserData} from "../../controller/serverTypes";
// context
import { useUserData } from "../userContext/UserContext";
import { useAppSettings } from "../appSetting/AppSettingContext";
// components and types
import BioDataForm from "./BioDataForm";
import TrainingForm from "./TrainingForm";
import YearGoalForm from "./YearGoalForm";
import {INewPageProps} from "./propTypes";
import {IValidState, IFormUserData} from "../dataTypes";
import {initialBioFormData,
  IFormYearData, initialValidObj,
  IFormBioData, IFormTrainingData,
} from "../dataTypes";
// notification
import {useNotification} from "../notification/NotificationBarContext";
// utils
import ResponsivePrimaryButton from "../utils/ResponsiveButton";

// new page
const NewPage = (): JSX.Element => {
  // states
  const [bioData, setBioData] = React.useState<IFormBioData>(initialBioFormData);
  const [yearData, setYearData] = React.useState<IFormYearData>({});
  const [trainData, setTrainData] = React.useState<IFormTrainingData>({});
  const [pageState, setPageState] = React.useState(0);
  const [validState, setValidState] = React.useState<IValidState>(initialValidObj);
  // context
  const { displayName, email, manager, jobTitle } = useUserData();
  const { draftAvailable, setAppSettings } = useAppSettings();
  // notify
  const notify = useNotification();
  // effect for validation
  React.useEffect(() => {
    // valid
    let valid = true;
    // loop over for validstate for any false
    for (const key in validState) {
      if (key !== "state") {
        // if any false
        if (!validState[key].valid) {
          setValidState(prevState => ({
            ...prevState,
            state: {valid: false, msg: validState[key].msg, location: validState[key].location}
          }));

          valid = false;
          return;
        }
      }
    }

    if (valid) {
      // if no false
      setValidState(prevState => ({
        ...prevState,
        state: {valid: true, msg: ""}
      }));
    }

  },[validState.bioData, validState.trainData, validState.yearData]);

  // effect for notifying user of validation state
  React.useEffect(() => {
    // pages by validation obj 0-year, 1- bio, 2- training
    const pagesArr = ["yearData", "bioData", "trainData"];
    const currPage = pagesArr[pageState];
    // get data from validation obj
    if (!validState[currPage].valid && validState[currPage].msg) {
      notify({show: true, msg: `${validState[currPage].location}: ${validState[currPage].msg}`, type: "warning" });
    } else {
      notify({show: false, msg: ""});
    }
  }, [pageState, validState]);

  // handler
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    // set data by name
    setBioData(oldData => {
      return {
        ...oldData,
        [name]: newValue
      };
    });
  };

  const handleNavigationClick = (name: string): void => {
    switch(name) {
      case "prev":
        // minus
        setPageState(pageState - 1);
        break;
      case "next":
        // add
        setPageState(pageState + 1);
        break;
      default:
        break;
    }
  };

  const handleFinishClick = (): void => {
    // make user obj
    const userObj: IFormUserData = {
      username: email,
      lineManager: manager,
      jobTitle: jobTitle
    };

    // server req with data
    fetchServer.createEntry(
      userObj,
      yearData,
      trainData,
      bioData as IFormBioData,
    )
    .then(res => {
      if (res) {
        setAppSettings(prevValue => ({
          ...prevValue,
          draftAvailable: true
        }));
        notify({show: true, isError: false, msg:"Draft created successfully"});
      }
    })
    .catch(error => {
      notify({show: true, isError: true, msg:"Error creating item", errorObj: error});
    });
  };

  return (
    <Stack tokens={{childrenGap: 8}}>
      <Stack>
        {
          displayName ?
          <Label>{displayName} PERSONAL DEVELOPMENT PLAN </Label> :
          <Label> PERSONAL DEVELOPMENT PLAN </Label>
        }
      </Stack>
      {
        draftAvailable &&
        <div> You have a plan created</div>
      }
      {
        !draftAvailable &&
        <>
          <Stack>
            {
              pageState === 0 &&
              <YearGoalForm
                yearData={yearData}
                setYearData={setYearData}
                validState={validState.yearData}
                setValidState={setValidState}
              />
            }
            {
              pageState === 1 &&
              <BioDataForm
                bioData={bioData}
                _onChange={handleInputChange}
                validState={validState.bioData}
                setValidState={setValidState}
              />
            }
            {
              pageState === 2 &&
              <TrainingForm
                trainData={trainData}
                setTrainData={setTrainData}
                validState={validState.trainData}
                setValidState={setValidState}
              />
            }
          </Stack>
          <Stack>
            <Stack horizontal horizontalAlign={"center"} tokens={{childrenGap: 7}}>
              <ResponsivePrimaryButton
                text={"Prev"}
                disabled={pageState === 0}
                onClick={() => handleNavigationClick("prev")}
                iconProps={{iconName: 'ChromeBack' }}
              />
              <ResponsivePrimaryButton
                text={"Next"}
                disabled={pageState === 2}
                onClick={() => handleNavigationClick("next")}
                iconProps={{iconName: 'ChromeBackMirrored' }}
              />
              <PrimaryButton text={"Finish"} onClick={handleFinishClick} disabled={!validState.state.valid}/>
              {/* <PrimaryButton text={"Test"} onClick={ () => {
                fetchServer.getUserList(email)
                  .then(res => console.log(res))
                  .catch(_ => setNotification({show: true, isError: true, msg:"Hi error"}));
              }}/> */}
            </Stack>
          </Stack>
        </>
      }

    </Stack>
  );
};

export default NewPage;
