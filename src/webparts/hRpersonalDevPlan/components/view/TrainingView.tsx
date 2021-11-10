import * as React from "react";
// ui
import {
  IDropdownOption, Dropdown, Stack,
  TextField, mergeStyleSets, PrimaryButton
} from "office-ui-fabric-react";
// server
import {fetchServer} from "../../controller/server";
// notification
import useNotificationHook from "../notification/hook";
// prop type
import {ITrainingCompProps} from "./propTypes";
interface ITrainDropdown extends IDropdownOption {
  key: string;
  text: string;
  trainTitle: string;
  trainDuration: string;
  trainStatus: string;
  trainObj: string;
}
// styles
const classes = mergeStyleSets({
   trainContainer: {
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     borderRadius: "4px",
     margin: "4px",
     boxShadow: "0px 0px 4px 0px #433f7e7d",
     overflow: "hidden",
     maxWidth: "80vw"
   },
   trainTitle: {
     padding: "5px",
     margin: "2px 2px",
     borderBottom: "1px solid blue"
   },
   trainText: {
     padding: "5px",
     margin: "2px 2px",
     maxWidth: "80vw",
     lineBreak: "anywhere"
   },
 });

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
    let optArr = [];
    // get train amt
    let amt = viewData.trainingTotal;
    // loop
    for (let i = 0; i < amt; i++) {
      // number
      let num = i+1;
      // string
      let trainTitle = "trainingTitle" + num;
      let trainDuration = "trainingDuration" + num;
      let trainStatus = "trainingStatus" + num;
      let trainObj = "trainingObjective" + num;
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
  const handleInputChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    const value = Number(newValue) > 100 ? "100"
              : Number(newValue) <  0 ? "0" : newValue;

    setStatusValue(value);
  };

  const handleUpdateClick = () => {
    // if nothing selected
    if (selectedTraining === null) return;

    // data string to update
    let trainStatus = selectedTraining.trainStatus;

    const updateItem = {
      [trainStatus]: Number(statusValue),
    };

    // call server
    console.log(updateItem);
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
    <Stack horizontalAlign={"center"} tokens={{childrenGap: 8}}>
      <Dropdown
        options={trainOptions}
        label={"Select Training"}
        selectedKey={selectedTraining ? selectedTraining.key : undefined}
        onChange={(_, item) => setSelectedTraining(item as ITrainDropdown)}
      />
      {
        selectedTraining &&
        <>
          <Stack wrap horizontal horizontalAlign={"center"} tokens={{childrenGap: 8}}>
            <div className={classes.trainContainer}>
              <div className={classes.trainTitle}>
                Title
              </div>
              <div className={classes.trainText}>
                {viewData[selectedTraining["trainTitle"]]}
              </div>
            </div>
            <div className={classes.trainContainer}>
              <div className={classes.trainTitle}>
                Duration
              </div>
              <div className={classes.trainText}>
                {viewData[selectedTraining["trainDuration"]]}
              </div>
            </div>
            <div className={classes.trainContainer}>
              <div className={classes.trainTitle}>
                Status
              </div>
              <div className={classes.trainText}>
                {viewData[selectedTraining["trainStatus"]] + "%"}
              </div>
            </div>
          </Stack>
          <Stack  wrap horizontal horizontalAlign={"center"} tokens={{childrenGap: 8}}>
            <div className={classes.trainContainer}>
              <div className={classes.trainTitle}>
                Objective
              </div>
              <div className={classes.trainText}>
                {viewData[selectedTraining["trainObj"]]}
              </div>
            </div>
          </Stack>
          {
            appData.viewPageMode === "normal" &&
            <Stack horizontal horizontalAlign={"stretch"} verticalAlign={"end"} tokens={{childrenGap: 8}}>
              <TextField
                type={"number"}
                label={"Update training status"}
                min={0}
                max={100}
                placeholder={"0% - 100%"}
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
