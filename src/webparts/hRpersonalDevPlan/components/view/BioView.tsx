import * as React from "react";
// fabric ui
import {
  Stack, Label,
  IStackStyles,
} from "office-ui-fabric-react";
// prop type
import {IBaseViewCompProps} from "./propTypes";
import { StackItem } from "@microsoft/sp-property-pane/node_modules/@microsoft/office-ui-fabric-react-bundle";
// custom
import ResponsiveTextFieldRO from "../utils/ResponsiveTextROField";

// styles
const stackStyles: IStackStyles = {
  root: {
    boxShadow: "0px 1px 3px 0px rgba(50, 50, 50, 0.71)",
    borderRadius: "10px",
    border: "1px solid #ff76004d"
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
        <ResponsiveTextFieldRO 
          readOnly 
          multiline
          autoAdjustHeight
          prefix="Your Strengths and Weaknesses:"
          value={viewData.stakeHolder1} 
        />
        <ResponsiveTextFieldRO 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="Stakeholders Requirements:" 
          value={viewData.stakeHolder2} 
        />
        <ResponsiveTextFieldRO 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="What is Next:" 
          value={viewData.strengthWeakness} 
        />
        <ResponsiveTextFieldRO 
          readOnly 
          multiline
          autoAdjustHeight 
          prefix="Steps Taken to reach Goal:" 
          value={viewData.stepsTaken} 
        />
        <ResponsiveTextFieldRO 
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
