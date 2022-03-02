import * as React from "react";
// office
import { TextField } from "office-ui-fabric-react";
import type { ITextFieldProps
} from "office-ui-fabric-react";
// query
import { useMediaQuery } from "react-responsive";

interface IAppProps extends ITextFieldProps {
  prefix?: string;
  children?: React.ReactNode;
}

const ResponsiveTextROField = ({ value, prefix}: IAppProps): JSX.Element => {

  // responsive
  const medium = useMediaQuery({ maxWidth: 940 });

  return (
    <TextField 
      readOnly 
      multiline
      autoAdjustHeight
      label={medium ? prefix : undefined}
      prefix={medium ? undefined : prefix}
      value={value} 
    />
  );
};

const ResponsiveTextFieldRO = ({value, prefix }:ITextFieldProps): JSX.Element  => {

  // responsive
  const medium = useMediaQuery({ maxWidth: 940 });

  return (
    <TextField 
      readOnly 
      multiline
      autoAdjustHeight
      label={medium ? prefix : undefined}
      prefix={medium ? undefined : prefix}
      value={value} 
    />
  );
};

export default ResponsiveTextFieldRO;