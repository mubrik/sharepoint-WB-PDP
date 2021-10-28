import * as React from "react";
import { Stack, Pivot, PivotItem } from "office-ui-fabric-react";

export interface IProps {
  pageState: string;
  setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar: React.FunctionComponent<IProps> = (props: IProps) => {
  return (
    <Stack>
      <Pivot
        aria-label={"pivot"}
        onLinkClick={(item) => {
          props.setPageState(item.props.itemKey);
        }}
        selectedKey={props.pageState}
      >
        <PivotItem headerText="Plan" itemKey="plan" />
        <PivotItem headerText="New" itemKey="new" />
      </Pivot>
    </Stack>
  );
};

export default NavBar;
