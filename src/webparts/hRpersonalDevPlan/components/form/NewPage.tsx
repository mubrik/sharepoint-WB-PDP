import * as React from "react";
// fabric ui
import {
   Stack,
   Label, PrimaryButton,
 } from "office-ui-fabric-react";
 // contexts
 import {RequestContext} from "../HRpersonalDevPlan";
// components and types
import BioDataForm from "./BioDataForm";
import TrainingForm from "./TrainingForm";
import YearGoalForm from "./YearGoalForm";
import {IInputControlProps} from "./propTypes";
import {IValidState} from "../dataTypes";
import {initialBioFormData,
  IFormYearData, initialValidObj,
  IFormBioData, IFormTrainingData
} from "../dataTypes";
import {IServer} from "../../controller/serverTypes";

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

  console.log("valid", validState.state.valid);

  // handler
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    console.log(name);
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
      <Label> Random stuff</Label>
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
  const makeRequest:IServer = React.useContext(RequestContext);

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
    makeRequest.getUserBioList()
      .then(res => console.log(res))
      .catch(err => console.log(err));

    makeRequest.createEntry(yearData, trainData, bioData as IFormBioData);
  };

  return(
    <Stack horizontal horizontalAlign={"center"} tokens={{childrenGap: 7}}>
      <PrimaryButton text={"Prev"} disabled={pageState === 0} onClick={() => handleNavigationClick("prev")}/>
      <PrimaryButton text={"Next"} disabled={pageState === 2} onClick={() => handleNavigationClick("next")}/>
      <PrimaryButton text={"Finish"} onClick={handleFinishClick} disabled={!validState.valid}/>
    </Stack>
  );
};

// const PersonalInfoForm = ({yearData, setYearData, data, _onChange}: IYearControlProps): JSX.Element => {
//
//   // states
//   const [itemsArray, setItemsArray] = React.useState<string[]>([]);
//   // const [yearList, setYearList] = React.useState(["2021", "2022", "2023"]);
//   const [selectedYear, setSelectedYear] = React.useState(null);
//   const [textField, setTextField] = React.useState("");
//
//   // year options, const for now
//   const yearOptions = [
//     {key: "2020", text: "2020"},
//     {key: "2021", text: "2021"},
//     {key: "2022", text: "2022"},
//   ];
//
//   // handlers
//   const handleAddYearItem = () => {
//     if (selectedYear === null) return;
//     // year
//     let _year = selectedYear ? selectedYear.key : null;
//     // item array
//     let itemArr = [...itemsArray];
//     // max is 3 years
//     if (itemArr.includes(_year)) {
//       return;
//     }
//     // add item
//     itemArr.push(_year);
//     // set state
//     setItemsArray(itemArr);
//
//     setYearData(oldState => ({
//       ...oldState,
//       [_year]: textField
//     }));
//
//   };
//
//   const handleRemoveItem = (param: string) => {
//     // item array
//     let itemArr = [...itemsArray];
//     let state = {...yearData};
//     // filter
//     let newArr = itemArr.filter(_year => _year !== param);
//     // mutate state
//     delete state[param];
//     // set state
//     setItemsArray(newArr);
//     setYearData(state);
//   };
//
//   // generate readonly text field
//   const generateTextField = (param: string) => {
//     return(
//       <Stack horizontal tokens={{childrenGap: 8}}>
//         <TextField key={param} value={yearData[param] as string} label={param} readOnly/>
//         <PrimaryButton text={"clear"} onClick={() => handleRemoveItem(param)}/>
//       </Stack>
//     );
//   };
//
//   return(
//     <Stack>
//       <Stack horizontal tokens={{childrenGap: 8}}>
//         <Dropdown
//           options={yearOptions}
//           label={"year"}
//           selectedKey={selectedYear ? selectedYear.key : undefined}
//           onChange={(_, item) => setSelectedYear(item)}
//         />
//         <TextField
//           value={textField}
//           onChange={(_, newValue) => setTextField(newValue)}
//           label={"Goal for the Year"}
//           />
//         <PrimaryButton text={"add"} onClick={handleAddYearItem}/>
//       </Stack>
//       <Stack>
//         {
//           itemsArray.map(_year => generateTextField(_year))
//         }
//       </Stack>
//       <Stack>
//         <StackItem>
//           <Label htmlFor={"strengthWeakness"}>Identify Your Strength and strengthWeakness</Label>
//           <TextField
//             multiline
//             id={"strengthWeakness"}
//             value={data.strengthWeakness}
//             onChange={(event, newValue) => _onChange("strengthWeakness", event, newValue)}
//           />
//         </StackItem>
//       </Stack>
//     </Stack>
//   );
// };
//
// const TrainingForm = ({trainData, setTrainData}: ITrainingControlProps): JSX.Element => {
//   // initial state
//   const initialState = {
//     trainingTitle: "",
//     trainingStatus: "",
//     trainingDuration: "",
//     trainingObjective: ""
//   };
//   // states
//   const [itemsArray, setItemsArray] = React.useState<string[]>([]);
//   const [stateData, setStateData] = React.useState(initialState);
//
//   // handlers
//   const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
//     setStateData(prevState => ({
//       ...prevState,
//       [name]:newValue
//     }));
//   };
//
//   const handleAddTrainingItem = () => {
//     // states
//     let _itemsArr = [...itemsArray];
//     let _trainData = {...trainData};
//     // array length
//     let arrLen = _itemsArr.length;
//     if (arrLen >= 4) return;
//     // create property name
//     let _name = stateData.trainingTitle.replace(/\s/g,'');
//     // if already there
//     if (itemsArray.includes(_name)) return;
//     // else mutate
//     _itemsArr.push(_name);
//     _trainData = {
//       ..._trainData,
//       [_name]:stateData
//     };
//     // set states
//     setItemsArray(_itemsArr);
//     setTrainData(_trainData);
//   };
//
//   const handleRemoveTrainingItem = (param: string) => {
//     // item array
//     let _itemArr = [...itemsArray];
//     let _trainData = {...trainData};
//     // filter
//     let newArr = _itemArr.filter(_name => _name !== param);
//     // mutate state
//     delete _trainData[param];
//     // set state
//     setItemsArray(newArr);
//     setTrainData(_trainData);
//   };
//
//   // generate readonly text field
//   const generateCardField = (param: string) => {
//     return(
//       <Stack horizontal tokens={{childrenGap: 8}}>
//         <TextField key={param+0} value={trainData[param].trainingTitle} label={param} readOnly/>
//         <TextField key={param+1} value={trainData[param].trainingObjective} label={param} readOnly/>
//         <PrimaryButton text={"clear"} onClick={() => handleRemoveTrainingItem(param)}/>
//       </Stack>
//     );
//   };
//
//   return (
//     <Stack>
//     <Stack>
//       {
//         itemsArray.map(_name => generateCardField(_name))
//       }
//     </Stack>
//       <Stack>
//         <StackItem>
//           <Label htmlFor={"trainingTitle1"}>Add Training</Label>
//           <TextField
//             id={"trainingTitle1"}
//             value={stateData.trainingTitle}
//             onChange={(event, newValue) => handleInputChange("trainingTitle", event, newValue)}
//             placeholder={"Training Name"}
//           />
//           <TextField
//             value={stateData.trainingObjective}
//             onChange={(event, newValue) => handleInputChange("trainingObjective", event, newValue)}
//             placeholder={"Training Objective"}
//           />
//           <TextField
//             value={stateData.trainingDuration}
//             onChange={(event, newValue) => handleInputChange("trainingDuration", event, newValue)}
//             placeholder={"Training Duration"}
//           />
//           <TextField
//             value={stateData.trainingStatus}
//             onChange={(event, newValue) => handleInputChange("trainingStatus", event, newValue)}
//             placeholder={"Training Status"}
//           />
//         </StackItem>
//         <PrimaryButton text={"add"} onClick={handleAddTrainingItem}/>
//       </Stack>
//     </Stack>
//   );
// };
// const StakeHoldersForm = ({data, _onChange}: IBaseInputProps): JSX.Element => {
//
//   return(
//     <Stack>
//       <StackItem>
//         <Label htmlFor={"stakeHolder1"}>Identity of stake holders</Label>
//         <TextField id={"stakeHolder1"} multiline value={data.stakeHolder1} onChange={(event, newValue) => _onChange("stakeHolder1", event, newValue)}/>
//       </StackItem>
//       <StackItem>
//         <Label htmlFor={"stakeHolder2"}>Discuss with stake holders</Label>
//         <TextField id={"stakeHolder2"} multiline value={data.stakeHolder2} onChange={(event, newValue) => _onChange("stakeHolder2", event, newValue)}/>
//       </StackItem>
//       <StackItem>
//         <Label htmlFor={"stakeHolder3"}>Steps stepsTaken</Label>
//         <TextField id={"stakeHolder3"} multiline value={data.stakeHolder3} onChange={(event, newValue) => _onChange("stakeHolder3", event, newValue)}/>
//       </StackItem>
//     </Stack>
//   );
// };

export default NewPage;
