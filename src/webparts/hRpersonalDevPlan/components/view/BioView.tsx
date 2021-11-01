import * as React from "react";
// fabric ui
import {TextField,
   Stack, StackItem,
   Label
 } from "office-ui-fabric-react";
 // prop type
 import {IBaseViewCompProps} from "./propTypes";


const BioView = ({viewData}: IBaseViewCompProps): JSX.Element => {

  return(
    <Stack>
      <StackItem>
        <Label htmlFor={"strengthWeakness"}>Identify Your Strength and strengthWeakness</Label>
        <TextField
          multiline
          readOnly
          id={"strengthWeakness"}
          value={viewData.strengthWeakness}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder1"}>Stakeholders requirements</Label>
        <TextField
          multiline
          readOnly
          id={"stakeHolder1"}
          value={viewData.stakeHolder1}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stakeHolder2"}>What's Next</Label>
        <TextField
          readOnly
          multiline
          id={"stakeHolder2"}
          value={viewData.stakeHolder2}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"stepsTaken"}>Steps Taken</Label>
        <TextField
          readOnly
          multiline
          id={"stepsTaken"}
          value={viewData.stepsTaken}
        />
      </StackItem>
      <StackItem>
        <Label htmlFor={"continousImprovement"}>Continous Improvement</Label>
        <TextField
          multiline
          readOnly
          id={"continousImprovement"}
          value={viewData.continousImprovement}
        />
      </StackItem>
    </Stack>
  );
};

export default BioView;
