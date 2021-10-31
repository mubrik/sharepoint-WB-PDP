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
             msg: "Minimum lenght of 5 characters"
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
        <Label htmlFor={"stakeHolder1"}>Identity of stake holders</Label>
        <TextField id={"stakeHolder1"} multiline value={bioData.stakeHolder1} onChange={(event, newValue) => _onChange("stakeHolder1", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder2"}>Discuss with stake holders</Label>
        <TextField id={"stakeHolder2"} multiline value={bioData.stakeHolder2} onChange={(event, newValue) => _onChange("stakeHolder2", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder3"}>Steps stepsTaken</Label>
        <TextField id={"stakeHolder3"} multiline value={bioData.stakeHolder3} onChange={(event, newValue) => _onChange("stakeHolder3", event, newValue)}/>
      </StackItem>
      <StackItem>
        <Label htmlFor={"strengthWeakness"}>Identify Your Strength and strengthWeakness</Label>
        <TextField
          multiline
          required
          id={"strengthWeakness"}
          value={bioData.strengthWeakness}
          onChange={(event, newValue) => _onChange("strengthWeakness", event, newValue)}
        />
      </StackItem>
    </Stack>
  );
};

export default BioForm;
