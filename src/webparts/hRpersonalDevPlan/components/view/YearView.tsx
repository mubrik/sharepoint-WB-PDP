import * as React from "react";
import {mergeStyleSets, Stack, Label} from "office-ui-fabric-react";
// prop type
import {IBaseViewCompProps} from "./propTypes";
// styles
const classes = mergeStyleSets({
  yearContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
    maxWidth: "80vw"
  },
  YearTitle: {
    padding: "5px",
    margin: "2px 2px",
    borderBottom: "1px solid blue"
  },
  yearGoal: {
    padding: "5px",
    margin: "2px 2px",
    lineBreak: "anywhere"
  },
});

const YearView = ({viewData}:IBaseViewCompProps): JSX.Element => {

  let _yearAmt = viewData.yearsTotal;

  const generateYearItem = (param: number): JSX.Element[] => {
    // arr to hold component
    let compArr = [];

    for (let i = 0; i < param; i++) {
      // number
      let num = i+1;
      // string
      let year = "year" + num;
      let yearGol = "yearGoal" + num;

      compArr.push(
        <div key={year} className={classes.yearContainer}>
          <h4 className={classes.YearTitle}>{viewData[year]}</h4>
          <p className={classes.yearGoal}>{viewData[yearGol]}</p>
        </div>
      );
    }

    return compArr;
  };

  return (
    <Stack horizontalAlign={"center"}>
      <Label>
        Your Dreams
      </Label>
      <Stack horizontal horizontalAlign={"center"}>
        {generateYearItem(_yearAmt)}
      </Stack>
    </Stack>
  );
};

export default YearView;
