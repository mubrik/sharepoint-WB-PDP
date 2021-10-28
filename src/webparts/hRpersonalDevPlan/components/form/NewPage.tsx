import * as React from "react";
// fabric ui
import {TextField,
   Stack, StackItem,
   Label, PrimaryButton
 } from "office-ui-fabric-react";
// components and types
import {initialFormData, IBaseInputProps} from "./dataTypes";

// new page
const NewPage:React.FunctionComponent = () => {

  // states
  const [formData, setFormData] = React.useState(initialFormData);
  const [pageState, setPageState] = React.useState(0);

  // handler
  const handleInputChange = (name: string, _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string, ) => {
    console.log(name);
    // set data by name
    setFormData(oldData => {
      return {
        ...oldData,
        [name]: newValue
      };
    });
  };

  return (
    <>
    <Stack>
      <Label> Random stuff</Label>
    </Stack>
    <Stack>
      {
        pageState === 0 &&
        <PersonalInfoForm
          data={formData}
          _onChange={handleInputChange}
        />
      }
      {
        pageState === 1 &&
        <StakeHoldersForm
          data={formData}
          _onChange={handleInputChange}
        />
      }
      {
        pageState === 2 &&
        <TrainingForm
          data={formData}
          _onChange={handleInputChange}
        />
      }
    </Stack>
    <Stack>
      <InputControl pageState={pageState} setPageState={setPageState}/>
    </Stack>
    </>
  );
};

const PersonalInfoForm = ({data, _onChange}: IBaseInputProps): JSX.Element => {

  return(
    <Stack>
      <Stack>
        <StackItem>
          <Label>What are your dreams</Label>
        </StackItem>
        <StackItem>
          <Label htmlFor={"year1"}>Year 1</Label>
          <TextField id={"year1"} value={data.year1} onChange={(event, newValue) => _onChange("year1", event, newValue)}/>
        </StackItem>
        <StackItem>
          <Label htmlFor={"year2"}>Year 2</Label>
          <TextField id={"year2"} value={data.year2} onChange={(event, newValue) => _onChange("year2", event, newValue)}/>
        </StackItem>
        <StackItem>
          <Label htmlFor={"year3"}>Year 3</Label>
          <TextField id={"year3"} value={data.year3} onChange={(event, newValue) => _onChange("year3", event, newValue)}/>
        </StackItem>
      </Stack>
      <Stack>
        <StackItem>
          <Label htmlFor={"strengthWeakness"}>Identify Your Strength and strengthWeakness</Label>
          <TextField
            multiline
            id={"strengthWeakness"}
            value={data.strengthWeakness}
            onChange={(event, newValue) => _onChange("strengthWeakness", event, newValue)}
          />
        </StackItem>
      </Stack>
    </Stack>
  );
};

const TrainingForm = ({data, _onChange}: IBaseInputProps): JSX.Element => {

  return(
    <Stack>
      <StackItem>
        <Label htmlFor={"trainingTitle1"}>Training 1</Label>
        <TextField
          id={"trainingTitle1"}
          value={data.trainingTitle1}
          onChange={(event, newValue) => _onChange("trainingTitle1", event, newValue)}
          placeholder={"Training Name"}
        />
        <TextField
          id={"trainingObjective1"}
          value={data.trainingObjective1}
          onChange={(event, newValue) => _onChange("trainingObjective1", event, newValue)}
          placeholder={"Training Objective"}
        />
        <TextField
          id={"trainingDuration1"}
          value={data.trainingDuration1}
          onChange={(event, newValue) => _onChange("trainingDuration1", event, newValue)}
          placeholder={"Training Duration"}
        />
        <TextField
          id={"trainingStatus1"}
          value={data.trainingStatus1}
          onChange={(event, newValue) => _onChange("trainingStatus1", event, newValue)}
          placeholder={"Training Status"}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"trainingTitle2"}>Training 2</Label>
        <TextField
          id={"trainingTitle2"}
          value={data.trainingTitle2}
          onChange={(event, newValue) => _onChange("trainingTitle2", event, newValue)}
          placeholder={"Training Name"}
          />
        <TextField
          id={"trainingObjective2"} value={data.trainingObjective2}
          onChange={(event, newValue) => _onChange("trainingObjective2", event, newValue)}
          placeholder={"Training Objective"}
        />
        <TextField id={"trainingDuration2"}
          value={data.trainingDuration2}
          onChange={(event, newValue) => _onChange("trainingDuration2", event, newValue)}
          placeholder={"Training Duration"}
          />
        <TextField id={"trainingStatus2"} value={data.trainingStatus2} onChange={(event, newValue) => _onChange("trainingStatus2", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"trainingTitle3"}>Training 3</Label>
        <TextField id={"trainingTitle3"} value={data.trainingTitle3} onChange={(event, newValue) => _onChange("trainingTitle3", event, newValue)}/>
        <TextField id={"trainingObjective3"} value={data.trainingObjective3} onChange={(event, newValue) => _onChange("trainingObjective3", event, newValue)}/>
        <TextField id={"trainingDuration3"} value={data.trainingDuration3} onChange={(event, newValue) => _onChange("trainingDuration3", event, newValue)}/>
        <TextField id={"trainingStatus3"} value={data.trainingStatus3} onChange={(event, newValue) => _onChange("trainingStatus3", event, newValue)}/>
      </StackItem>
    </Stack>
  );
};

const StakeHoldersForm = ({data, _onChange}: IBaseInputProps): JSX.Element => {

  return(
    <Stack>
      <StackItem>
        <Label htmlFor={"stakeHolder1"}>Identity of stake holders</Label>
        <TextField id={"stakeHolder1"} multiline value={data.stakeHolder1} onChange={(event, newValue) => _onChange("stakeHolder1", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder2"}>Discuss with stake holders</Label>
        <TextField id={"stakeHolder2"} multiline value={data.stakeHolder2} onChange={(event, newValue) => _onChange("stakeHolder2", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder3"}>Steps stepsTaken</Label>
        <TextField id={"stakeHolder3"} multiline value={data.stakeHolder3} onChange={(event, newValue) => _onChange("stakeHolder3", event, newValue)}/>
      </StackItem>
    </Stack>
  );
};

interface IInputControlProps {
  pageState: number;
  setPageState: React.Dispatch<React.SetStateAction<number>>;
}

const InputControl:React.FunctionComponent<IInputControlProps> = (props:IInputControlProps) => {

  // event handlers
  const handleNavigationClick = (name: string) => {
    switch(name) {
      case "prev":
        // minus
        props.setPageState(props.pageState - 1);
        break;
      case "next":
        // add
        props.setPageState(props.pageState + 1);
        break;
      default:
        break;
    }
  };

  return(
    <Stack horizontal horizontalAlign={"center"} tokens={{childrenGap: 7}}>
      <PrimaryButton text={"Prev"} disabled={props.pageState === 0} onClick={() => handleNavigationClick("prev")}/>
      <PrimaryButton text={"Next"} disabled={props.pageState === 2} onClick={() => handleNavigationClick("next")}/>
      <PrimaryButton text={"Finish"}/>
    </Stack>
  );
};

export default NewPage;
