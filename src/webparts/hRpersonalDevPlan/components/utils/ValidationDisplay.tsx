import * as React from "react";
import {mergeStyleSets} from "office-ui-fabric-react";
// types
import {IValidationObj} from "../dataTypes";
// responsive
import { useMediaQuery } from "react-responsive";
// styles
const gridCLasses = mergeStyleSets({
  invalidContainer: {
    position: "absolute",
    zIndex:"2",
    top: "32px",
    right: "20px",
    width: "auto",
    overflow: "hidden",
    color: "rgb(106, 35, 5)"
  },
  invalidContainerMobile: {
    width: "auto",
    overflow: "hidden",
    color: "rgb(106, 35, 5)"
  }
});

const ValidationDisplay = ({valid, msg}: IValidationObj): JSX.Element => {
  // responsive query
  const medium = useMediaQuery({ maxWidth: 479 });

  return (
    <>
      {
        valid ?
        null :
        <div className={medium ?
          gridCLasses.invalidContainerMobile :
          gridCLasses.invalidContainer
        }>
          <p>{msg}</p>
        </div>
      }
    </>
  );
};

export default ValidationDisplay;
