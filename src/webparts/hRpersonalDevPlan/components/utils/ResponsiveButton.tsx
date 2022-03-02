import * as React from "react";
import {
  PrimaryButton,
  IconButton,
  IButtonProps, DefaultButton,
} from "office-ui-fabric-react";
// responsive
import { useMediaQuery } from "react-responsive";
// interface 
interface IResponsiveButton extends IButtonProps {
  type?: "default" | "primary";
}

const ResponsivePrimaryButton = (
  // props
  {type, ...props}: IResponsiveButton
): JSX.Element => {
  // responsive query
  const medium = useMediaQuery({ maxWidth: 479 });
  const _type = type ? type : "primary";

  return (
    <>
      { // medium breakpoint render icon only
        medium ? 
        <IconButton {...props} /> :
        // if not render based on type
        _type === "default" ? <DefaultButton {...props} /> :
        <PrimaryButton {...props} />
      }
    </>
  );
};

export default ResponsivePrimaryButton;
