import * as React from "react";
import {
  TextField,
  Stack,
} from "office-ui-fabric-react";
// types
import {IValidationObj} from "../dataTypes";

const ValidationDisplay = ({valid, msg}: IValidationObj): JSX.Element => {

  return (
    <>
      {
        valid ?
        null :
        <Stack horizontal horizontalAlign={"end"}>
          <p>{msg}</p>
        </Stack>
      }
    </>
  );
};

export default ValidationDisplay;
