import * as React from "react";
// fabric ui
import {
  Stack, Label,
  IStackStyles, TextField
} from "office-ui-fabric-react";
// prop type
import {IBaseViewCompProps} from "./propTypes";
import { StackItem } from "@microsoft/sp-property-pane/node_modules/@microsoft/office-ui-fabric-react-bundle";
// styles
const stackStyles: IStackStyles = {
  root: {
    boxShadow: "0px 1px 3px 0px rgba(50, 50, 50, 0.71)",
    borderRadius: "10px"
  }
};

const BioView = ({viewData}: IBaseViewCompProps): JSX.Element => {

  return(
    <Stack horizontalAlign={"stretch"} styles={stackStyles} tokens={{childrenGap: 6, padding: 6}}>
      <StackItem align="center">
        <Label>
          Bio Data:
        </Label>
      </StackItem>
      <Stack tokens={{childrenGap:8}} horizontalAlign={"stretch"}>
        <TextField 
          readOnly 
          multiline
          autoAdjustHeight
          prefix="Your Strengths and Weaknesses:" 
          value={viewData.stakeHolder1} 
        />
        <TextField 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="Stakeholders Requirements:" 
          value={viewData.stakeHolder2} 
        />
        <TextField 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="What is Next:" 
          value={viewData.strengthWeakness} 
        />
        <TextField 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="Steps Taken to reach Goal:" 
          value={viewData.stepsTaken} 
        />
        <TextField 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="Continous Improvement:" 
          value={viewData.continousImprovement} 
        />
      </Stack>
    </Stack>
  );
};

export default BioView;
