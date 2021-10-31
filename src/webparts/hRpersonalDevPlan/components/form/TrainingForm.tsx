import * as React from "react";
// fabric ui
import {TextField,
   Stack, Label,
   PrimaryButton, mergeStyleSets
 } from "office-ui-fabric-react";
// components and types
import {ITrainingControlProps,} from "./propTypes";
import ValidationDisplay from "../utils/ValidationDisplay";
// data
import {initialTrainingFormData} from "../dataTypes";


// styles
const gridCLasses = mergeStyleSets({
  mainGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    overflow: "hidden",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    cursor: "pointer",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
  },
  itemLabel: {
    padding: "5px"
  }
});


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
      <div className={gridCLasses.itemContainer}>
        <TextField key={param+0} value={trainData[param].trainingTitle} readOnly/>
        <PrimaryButton text={"del"} onClick={() => handleRemoveTrainingItem(param)}/>
      </div>
    );
  };

  return (
    <Stack>
      <ValidationDisplay
        valid={validState.valid}
        msg={validState.msg}
      />
      <Stack tokens={{childrenGap:8}}>
        <Label>Add Training</Label>
        <Stack horizontal wrap tokens={{childrenGap:8}}>
          <TextField
            id={"trainingTitle1"}
            value={stateData.trainingTitle}
            onChange={(event, newValue) => handleInputChange("trainingTitle", event, newValue)}
            placeholder={"Training Name"}
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
        </Stack>
        <Stack tokens={{childrenGap:8, padding:2}}>
          <TextField
            multiline
            value={stateData.trainingObjective}
            onChange={(event, newValue) => handleInputChange("trainingObjective", event, newValue)}
            placeholder={"Training Objective"}
          />
          <PrimaryButton
            text={"add"}
            onClick={handleAddTrainingItem}
            disabled={itemsArray.length === 4}
          />
        </Stack>
        <div className={gridCLasses.mainGrid}>
          {
            itemsArray.map(_name => generateCardField(_name))
          }
        </div>
      </Stack>
    </Stack>
  );
};

export default TrainingForm;
