import * as React from "react";
// fabric ui
import {TextField,
   Stack, Label,
   PrimaryButton, mergeStyleSets,
   IconButton
} from "office-ui-fabric-react";
import ResponsivePrimaryButton from "../utils/ResponsiveButton";
// components and types
import {ITrainingControlProps} from "./propTypes";
// import ValidationDisplay from "../utils/ValidationDisplay";
// data
import {initialTrainingFormData} from "../dataTypes";
// notify
import useNotificationHook from "../notification/hook";

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
    flexDirection: "column",
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
  // notify
  const notify = useNotificationHook();

  // effect for validation
  React.useEffect(() => {
    // items
    const _items = [...itemsArray];
    // not valid
    if (_items.length === 0) {

      setValidState(prevState => ({
        ...prevState,
        trainData: {
          valid: false,
          msg: "Please add a training",
          location: "Training-Form"
        }
      }));
    } else {

      setValidState(prevState => ({
        ...prevState,
        trainData: {
          valid: true,
          msg: "",
          location: "Training-Form"
        }
      }));

    }
  }, [itemsArray]);

  // effect to update item array on mount
  React.useEffect(() => {
    const _items = [...itemsArray];
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
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    if (name === "trainingStatus") {
      newValue = Number(newValue) > 100 ? "100"
                : Number(newValue) <  0 ? "0" : newValue;
    }

    setStateData(prevState => ({
      ...prevState,
      [name]:newValue
    }));
  };

  const handleAddTrainingItem = (): void => {
    // states
    const _itemsArr = [...itemsArray];
    let _trainData = {...trainData};
    // array length
    const arrLen = _itemsArr.length;
    if (arrLen >= 4) return;
    // create property name
    const _name = stateData.trainingTitle.replace(/\s/g,'');
    // if already there
    if (itemsArray.includes(_name)) {
      notify({show: true, type: "warning", msg: `Training ${_name} already added`});
      return;
    }
    // else mutate
    _itemsArr.push(_name);
    _trainData = {
      ..._trainData,
      [_name]:stateData
    };
    // set states
    setItemsArray(_itemsArr);
    setTrainData(_trainData);
    // clear form 
    setStateData(initialTrainingFormData);
  };

  const handleRemoveTrainingItem = (param: string): void => {
    // item array
    const _itemArr = [...itemsArray];
    const _trainData = {...trainData};
    // filter
    const newArr = _itemArr.filter(_name => _name !== param);
    // mutate state
    delete _trainData[param];
    // set state
    setItemsArray(newArr);
    setTrainData(_trainData);
  };

  // generate readonly text field
  const generateCardField = (param: string): JSX.Element => {
    return(
      <Stack verticalAlign="center" tokens={{childrenGap: 5, padding: 4}}>
        <TextField key={param+0} prefix="Title" value={trainData[param].trainingTitle} readOnly/>
        <TextField key={param+1} prefix="Duration" value={trainData[param].trainingDuration} readOnly/>
        <TextField key={param+2} prefix="Status" value={trainData[param].trainingStatus} suffix="%" readOnly/>
        <ResponsivePrimaryButton 
          text={"Clear"}
          iconProps={{iconName: "Clear"}} 
          title="Clear" 
          onClick={() => handleRemoveTrainingItem(param)}
          type="default"
        />
      </Stack>
    );
  };

  return (
    <Stack>
      <Stack tokens={{childrenGap:8}}>
        <Label>Add Training</Label>
        <Stack horizontal wrap tokens={{childrenGap:8, padding:4}}>
          <TextField
            required
            id={"trainingTitle1"}
            label={"Training Name"}
            value={stateData.trainingTitle}
            onChange={(event, newValue) => handleInputChange("trainingTitle", event, newValue)}
            placeholder={"eg. Project Management - PMP"}
          />
          <TextField
            label={"Training Duration"}
            value={stateData.trainingDuration}
            onChange={(event, newValue) => handleInputChange("trainingDuration", event, newValue)}
            placeholder={"eg. 1 month, 2 years"}
          />
          <TextField
            type={"number"}
            label={"Training Status"}
            min={0}
            max={100}
            value={stateData.trainingStatus}
            onChange={(event, newValue) => handleInputChange("trainingStatus", event, newValue)}
            placeholder={"0 - 100"}
          />
        </Stack>
        <Stack tokens={{childrenGap:8, padding:2}}>
          <TextField
            multiline
            required
            label={"Training Objective"}
            value={stateData.trainingObjective}
            onChange={(event, newValue) => handleInputChange("trainingObjective", event, newValue)}
            placeholder={"Training Objective"}
          />
          <PrimaryButton
            text={"Add Training"}
            onClick={handleAddTrainingItem}
            disabled={itemsArray.length === 4 || stateData.trainingTitle === "" || stateData.trainingObjective === "" }
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
