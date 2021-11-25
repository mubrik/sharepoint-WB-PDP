import * as React from "react";
// ui
import {
  IStackStyles, Stack, 
  Label, TextField, StackItem
} from "office-ui-fabric-react";
// prop type
import {IBaseViewCompProps} from "./propTypes";
// styles
const stackStyles: IStackStyles = {
  root: {
    boxShadow: "0px 1px 3px 0px rgba(50, 50, 50, 0.71)",
    borderRadius: "10px",
    border: "1px solid #005aff36"
  }
};

const YearView = ({viewData}:IBaseViewCompProps): JSX.Element => {

  const _yearAmt = viewData.yearsTotal;

  const generateYearItem = (param: number): JSX.Element[] => {
    // arr to hold component
    const compArr = [];

    for (let i = 0; i < param; i++) {
      // number
      const num = i+1;
      // string
      const year = "year" + num;
      const yearGol = "yearGoal" + num;

      compArr.push(
        <Stack tokens={{childrenGap: 6, padding:5}}>
          <TextField readOnly key={year} prefix={"Year:"} value={viewData[year]}/>
          <TextField readOnly autoAdjustHeight multiline key={year} prefix={"Goal:"} value={viewData[yearGol]}/>
        </Stack>
      );
    }

    return compArr;
  };

  return (
    <Stack horizontalAlign={"stretch"} tokens={{childrenGap: 9, padding: 6}} styles={stackStyles}>
      <StackItem align="center" verticalFill>
        <Label>
          Year Goals:
        </Label>
      </StackItem>
      <Stack tokens={{childrenGap: 6}} horizontal horizontalAlign={"space-evenly"}>
        {generateYearItem(_yearAmt)}
      </Stack>
    </Stack>
  );
};

export default YearView;
