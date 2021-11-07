import * as React from "react";
// fabric ui
import {
   Stack,
   Label, mergeStyleSets
} from "office-ui-fabric-react";
// prop type
import {IBaseViewCompProps} from "./propTypes";
// styles
const classes = mergeStyleSets({
   bioContainer: {
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     borderRadius: "4px",
     margin: "4px",
     boxShadow: "0px 0px 4px 0px #433f7e7d",
     overflow: "hidden",
     maxWidth: "80vw"
   },
   bioTitle: {
     padding: "5px",
     margin: "2px 2px",
     borderBottom: "1px solid blue"
   },
   bioGoal: {
     padding: "5px",
     margin: "2px 2px",
     lineBreak: "anywhere"
   },
 });

const BioView = ({viewData}: IBaseViewCompProps): JSX.Element => {

  return(
    <Stack horizontalAlign={"center"}>
      <Label>
        Bio
      </Label>
      <Stack horizontal wrap tokens={{childrenGap:8}} horizontalAlign={"center"}>
        <div className={classes.bioContainer}>
          <h4 className={classes.bioTitle}>
            Identify Your Strengths and Weaknesses
          </h4>
          <div className={classes.bioGoal}>
            {viewData.strengthWeakness}
          </div>
        </div>
        <div className={classes.bioContainer}>
          <h4 className={classes.bioTitle}>
            Stakeholders Requirements
          </h4>
          <div className={classes.bioGoal}>
            {viewData.stakeHolder1}
          </div>
        </div>
        <div className={classes.bioContainer}>
          <h4 className={classes.bioTitle}>
            What's Next?
          </h4>
          <div className={classes.bioGoal}>
            {viewData.stakeHolder2}
          </div>
        </div>
        <div className={classes.bioContainer}>
          <h4 className={classes.bioTitle}>
            Steps Taken to reach Goal
          </h4>
          <div className={classes.bioGoal}>
            {viewData.stepsTaken}
          </div>
        </div>
        <div className={classes.bioContainer}>
          <h4 className={classes.bioTitle}>
            Continous Improvement
          </h4>
          <div className={classes.bioGoal}>
            {viewData.continousImprovement}
          </div>
        </div>
      </Stack>
    </Stack>
  );
};

export default BioView;
