import * as React from "react";
// ui
import {
  IDropdownOption, Dropdown, Stack,
  TextField, PrimaryButton
} from "office-ui-fabric-react";
// server
import {fetchServer} from "../../controller/server";
// notification
import useNotificationHook from "../notification/hook";
// prop type
import {ITrainingCompProps} from "./propTypes";
// custom
import ResponsiveTextFieldRO from "../utils/ResponsiveTextROField";
interface ITrainDropdown extends IDropdownOption {
  key: string;
  text: string;
  trainTitle: string;
  trainDuration: string;
  trainStatus: string;
  trainObj: string;
}

const TrainingView  = ({viewData, setViewStateData, appData}:ITrainingCompProps): JSX.Element => {
  // states
  const [trainOptions, setTrainOptions] = React.useState<ITrainDropdown[]>([]);
  const [selectedTraining, setSelectedTraining] = React.useState<null|ITrainDropdown>(null);
  const [statusValue, setStatusValue] = React.useState("");
  // notify
  const setNotification = useNotificationHook();

  // effect to set training options
  React.useEffect(() => {
    // options arr
    const optArr = [];
    // get train amt
    const amt = viewData.trainingTotal;
    // loop
    for (let i = 0; i < amt; i++) {
      // number
      const num = i+1;
      // string
      const trainTitle = "trainingTitle" + num;
      const trainDuration = "trainingDuration" + num;
      const trainStatus = "trainingStatus" + num;
      const trainObj = "trainingObjective" + num;
      // option item
      const trainItem = {
        key: trainTitle,
        text: viewData[trainTitle],
        trainTitle: trainTitle,
        trainDuration: trainDuration,
        trainStatus: trainStatus,
        trainObj: trainObj
      };
      // push
      optArr.push(trainItem);
    }

    setTrainOptions(optArr);
  }, [viewData]);

  // handlers
  const handleInputChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    const value = Number(newValue) > 100 ? "100"
              : Number(newValue) <  0 ? "0" : newValue;

    setStatusValue(value);
  };

  const handleUpdateClick = (): void => {
    // if nothing selected
    if (selectedTraining === null) return;

    // data string to update
    const trainStatus = selectedTraining.trainStatus;

    const updateItem = {
      [trainStatus]: Number(statusValue),
    };

    // call server
    fetchServer.updateEntry(viewData.Id, updateItem)
      .then(_ => {
        setNotification({show: true, isError: false, msg:"Training updated successfully"});
        // update view
        setViewStateData(prevValue => ({
          ...prevValue,
          status: "idle"
        }));
      })
      .catch(error => {
        setNotification({show: true, isError: true, msg:"Error updating training status", errorObj: error});
      });


  };

  return (
    <Stack horizontalAlign={"stretch"} tokens={{childrenGap: 8}}>
      <Dropdown
        options={trainOptions}
        label={"Select a Training:"}
        selectedKey={selectedTraining ? selectedTraining.key : undefined}
        onChange={(_, item) => setSelectedTraining(item as ITrainDropdown)}
      />
      {
        selectedTraining &&
        <>
          <Stack wrap horizontal horizontalAlign={"stretch"} tokens={{childrenGap: 8}}>
            <ResponsiveTextFieldRO readOnly prefix="Title" value={viewData[selectedTraining["trainTitle"]]}/>
            <ResponsiveTextFieldRO readOnly prefix="Duration" value={viewData[selectedTraining["trainDuration"]]}/>
            <ResponsiveTextFieldRO readOnly prefix="Status" suffix="%" value={viewData[selectedTraining["trainStatus"]]}/>
          </Stack>
          <Stack horizontalAlign={"stretch"} tokens={{childrenGap: 8}}>
            <ResponsiveTextFieldRO 
              readOnly 
              multiline 
              autoAdjustHeight 
              prefix="Objective:" 
              value={viewData[selectedTraining["trainObj"]]}
            />
          </Stack>
          {
            appData.viewPageMode === "normal" &&
            <Stack horizontal horizontalAlign={"stretch"} verticalAlign={"end"} tokens={{childrenGap: 8}}>
              <TextField
                type={"number"}
                label={"Update selected training status:"}
                min={0}
                max={100}
                placeholder={"0 - 100"}
                value={statusValue}
                onChange={handleInputChange}
              />
              <PrimaryButton
                text={"Update"}
                disabled={statusValue === ""}
                onClick={handleUpdateClick}
              />
            </Stack>
          }

        </>
      }
    </Stack>
  );
};

export default TrainingView;
