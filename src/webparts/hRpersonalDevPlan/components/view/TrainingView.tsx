import * as React from "react";
// prop type
import {IBaseViewCompProps} from "./propTypes";

const TrainingView  = ({viewData}:IBaseViewCompProps): JSX.Element => {

  let _trainAmt = viewData.trainingTotal;

  const generateItemArray = (param: number): JSX.Element[] => {
    // arr to hold component
    let compArr = [];

    for (let i = 0; i < param; i++) {
      // number
      let num = i+1;
      // string
      let trainTitle = "trainingTitle" + num;
      let trainDuration = "trainingDuration" + num;
      let trainStatus = "trainingStatus" + num;
      let trainObj = "trainingObjective" + num;

      compArr.push(
        <div key={trainTitle}>
          <p>Training Title: {viewData[trainTitle]}</p>
          <p>Training Duration: {viewData[trainDuration]}</p>
          <p>Training Status: {viewData[trainStatus]}</p>
          <p>Training Objective: {viewData[trainObj]}</p>
        </div>
      );
    }

    return compArr;
  };

  return (
    <div>
      {generateItemArray(_trainAmt)}
    </div>
  );
};

export default TrainingView;
