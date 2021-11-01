import * as React from "react";
// prop type
import {IBaseViewCompProps} from "./propTypes";

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
        <div key={year}>
          <p>year: {viewData[year]}</p>
          <p>goal: {viewData[yearGol]}</p>
        </div>
      );
    }

    return compArr;
  };

  return (
    <div>
      {generateYearItem(_yearAmt)}
    </div>
  );
};

export default YearView;
