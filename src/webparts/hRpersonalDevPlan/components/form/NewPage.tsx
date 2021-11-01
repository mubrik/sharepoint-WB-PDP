import * as React from "react";
// fabric ui
import {
   Stack,
   Label, PrimaryButton,
 } from "office-ui-fabric-react";
import {fetchServer} from "../../controller/server";
import {IUserData} from "../../controller/serverTypes";
// context
import {UserContext} from "../HRpersonalDevPlan";
// components and types
import BioDataForm from "./BioDataForm";
import TrainingForm from "./TrainingForm";
import YearGoalForm from "./YearGoalForm";
import {IInputControlProps} from "./propTypes";
import {IValidState, IFormUserData} from "../dataTypes";
import {initialBioFormData,
  IFormYearData, initialValidObj,
  IFormBioData, IFormTrainingData
} from "../dataTypes";
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
            state: {valid: false, msg: validState[key].msg}
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
  // context
  const userData:IUserData = React.useContext(UserContext);

  // handler
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    // set data by name
    setBioData(oldData => {
      return {
        ...oldData,
        [name]: newValue
      };
    });
  };

  return (
    <Stack tokens={{childrenGap: 8}}>
    <Stack>
      {
        userData.ok ?
        <Label>{userData.displayName} PERSONAL DEVELOPMENT PLAN </Label> :
        <Label> PERSONAL DEVELOPMENT PLAN </Label>
      }
    </Stack>
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
      <InputControl
        bioData={bioData}
        trainData={trainData}
        yearData={yearData}
        pageState={pageState}
        setPageState={setPageState}
        validState={validState.state}
        setValidState={setValidState}
      />
    </Stack>
    </Stack>
  );
};



const InputControl:React.FunctionComponent<IInputControlProps> = (
  {pageState, setPageState, yearData, trainData, bioData, validState}:IInputControlProps) => {

  // context
  const userData:IUserData = React.useContext(UserContext);

  // event handlers
  const handleNavigationClick = (name: string) => {
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

  const handleFinishClick = () => {
    // make user obj
    const userObj: IFormUserData = {
      username: userData.email,
      lineManager: userData.manager,
      jobTitle: userData.jobTitle
    };

    // server req with data
    fetchServer.createEntry(
      userObj,
      yearData,
      trainData,
      bioData as IFormBioData,
    );
  };

  return(
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
      <PrimaryButton text={"Finish"} onClick={handleFinishClick} disabled={!validState.valid}/>
    </Stack>
  );
};

export default NewPage;
