import * as React from "react";
// fabric ui
import {TextField,
   Stack, StackItem,
   Label
 } from "office-ui-fabric-react";
// components and types
import {IBioControlProps,} from "./propTypes";
import ValidationDisplay from "../utils/ValidationDisplay";


const BioForm = ({bioData, _onChange, validState, setValidState}: IBioControlProps): JSX.Element => {

  // effect for validation
  React.useEffect(() => {
    // default true
    let isValid = true;
    // loop, break if any invalid
    for (const key in bioData) {
       let _text: string = bioData[key];

       if (_text.length <= 5 || _text === "") {
         isValid = false;
         setValidState(prevState => ({
           ...prevState,
           bioData: {
             valid: false,
             msg: "Minimum length of 5 characters"
           }
         }));
         break;
       }
     }
     // runs if loop doesnt break
     if (isValid) {
       setValidState(prevState => ({
         ...prevState,
         bioData: {
           valid: true,
           msg: ""
         }
       }));
     }

  }, [bioData]);

  return(
    <Stack>
      <ValidationDisplay
        valid={validState.valid}
        msg={validState.msg}
      />
      <StackItem>
        <Label htmlFor={"strengthWeakness"}>Identify Your Strength and strengthWeakness</Label>
        <TextField
          multiline
          required
          id={"strengthWeakness"}
          value={bioData.strengthWeakness}
          onChange={(event, newValue) => _onChange("strengthWeakness", event, newValue)}
          placeholder={"Strengths: My weaknesses: Opportunities:  The identified threat: "}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder1"}>Stakeholders requirements</Label>
        <TextField
          multiline
          required
          id={"stakeHolder1"}
          value={bioData.stakeHolder1}
          onChange={(event, newValue) => _onChange("stakeHolder1", event, newValue)}
          placeholder={"Ascertain the identity of your stakeholders and what their requirements are."}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder2"}>What's Next</Label>
        <TextField
          required
          multiline
          id={"stakeHolder2"}
          value={bioData.stakeHolder2}
          onChange={(event, newValue) => _onChange("stakeHolder2", event, newValue)}
          placeholder={"Identify, discuss and agree the actions that you and the company need to put into place to advance your career to the desired target."}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stepsTaken"}>Steps Taken</Label>
        <TextField
          required
          multiline
          id={"stepsTaken"}
          value={bioData.stepsTaken}
          onChange={(event, newValue) => _onChange("stepsTaken", event, newValue)}
          placeholder={"Steps taken to implement the agreed action."}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"continousImprovement"}>Continous Improvement</Label>
        <TextField
          multiline
          required
          id={"continousImprovement"}
          value={bioData.continousImprovement}
          onChange={(event, newValue) => _onChange("continousImprovement", event, newValue)}
          placeholder={"Embark on a “Continuous Improvement” programme on those performance features you are already comfortable with."}
        />
      </StackItem>
    </Stack>
  );
};

export default BioForm;
