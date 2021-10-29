import * as React from "react";
// fabric ui
import {TextField,
   Stack, StackItem,
   Label, PrimaryButton,
 } from "office-ui-fabric-react";
// components and types
import {ITrainingControlProps,} from "./propTypes";
import ValidationDisplay from "../utils/ValidationDisplay";
// data
import {initialTrainingFormData} from "../dataTypes";


const TrainingForm = ({trainData, setTrainData, validState, setValidState}: ITrainingControlProps): JSX.Element => {
  // states
  const [itemsArray, setItemsArray] = React.useState<string[]>([]);
  const [stateData, setStateData] = React.useState(initialTrainingFormData);

  // effect for validation
  React.useEffect(() => {
    // items
    let _items = [...itemsArray];
    // not valid
    if (_items.length === 0) {

      setValidState(prevState => ({
        ...prevState,
        trainData: {
          valid: false,
          msg: "Please add a training"
        }
      }));
    } else {

      setValidState(prevState => ({
        ...prevState,
        trainData: {
          valid: true,
          msg: ""
        }
      }));

    }
  }, [itemsArray]);

  // effect to update item array on mount
  React.useEffect(() => {
    let _items = [...itemsArray];
    // loop over
    Object.keys(trainData).forEach(_training => {
      if (!_items.includes(_training)) {
        _items.push(_training);
      }
    });
    // mutate
    setItemsArray(_items);
  },[trainData]);

  // handlers
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setStateData(prevState => ({
      ...prevState,
      [name]:newValue
    }));
  };

  const handleAddTrainingItem = () => {
    // states
    let _itemsArr = [...itemsArray];
    let _trainData = {...trainData};
    // array length
    let arrLen = _itemsArr.length;
    if (arrLen >= 4) return;
    // create property name
    let _name = stateData.trainingTitle.replace(/\s/g,'');
    // if already there
    if (itemsArray.includes(_name)) return;
    // else mutate
    _itemsArr.push(_name);
    _trainData = {
      ..._trainData,
      [_name]:stateData
    };
    // set states
    setItemsArray(_itemsArr);
    setTrainData(_trainData);
  };

  const handleRemoveTrainingItem = (param: string) => {
    // item array
    let _itemArr = [...itemsArray];
    let _trainData = {...trainData};
    // filter
    let newArr = _itemArr.filter(_name => _name !== param);
    // mutate state
    delete _trainData[param];
    // set state
    setItemsArray(newArr);
    setTrainData(_trainData);
  };

  // generate readonly text field
  const generateCardField = (param: string) => {
    return(
      <Stack horizontal tokens={{childrenGap: 8}}>
        <TextField key={param+0} value={trainData[param].trainingTitle} label={param} readOnly/>
        <TextField key={param+1} value={trainData[param].trainingObjective} label={param} readOnly/>
        <PrimaryButton text={"clear"} onClick={() => handleRemoveTrainingItem(param)}/>
      </Stack>
    );
  };

  return (
    <Stack>
      <ValidationDisplay
        valid={validState.valid}
        msg={validState.msg}
      />
    <Stack>
      {
        itemsArray.map(_name => generateCardField(_name))
      }
    </Stack>
      <Stack>
        <StackItem>
          <Label htmlFor={"trainingTitle1"}>Add Training</Label>
          <TextField
            id={"trainingTitle1"}
            value={stateData.trainingTitle}
            onChange={(event, newValue) => handleInputChange("trainingTitle", event, newValue)}
            placeholder={"Training Name"}
          />
          <TextField
            value={stateData.trainingObjective}
            onChange={(event, newValue) => handleInputChange("trainingObjective", event, newValue)}
            placeholder={"Training Objective"}
          />
          <TextField
            value={stateData.trainingDuration}
            onChange={(event, newValue) => handleInputChange("trainingDuration", event, newValue)}
            placeholder={"Training Duration"}
          />
          <TextField
            value={stateData.trainingStatus}
            onChange={(event, newValue) => handleInputChange("trainingStatus", event, newValue)}
            placeholder={"Training Status"}
          />
        </StackItem>
        <PrimaryButton text={"add"} onClick={handleAddTrainingItem}/>
      </Stack>
    </Stack>
  );
};

export default TrainingForm;
