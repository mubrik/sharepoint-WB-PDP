import * as React from "react";
import { Stack, Pivot, PivotItem } from "office-ui-fabric-react";
//context
import {UserContext} from "../HRpersonalDevPlan";
// types
import {IUserData} from "../../controller/serverTypes";

export interface IProps {
  pageState: string;
  setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar: React.FunctionComponent<IProps> = (props: IProps) => {
  // user data
  const userData:IUserData = React.useContext(UserContext);

  return (
    <Stack>
      <Pivot
        aria-label={"pivot"}
        onLinkClick={(item) => {
          props.setPageState(item.props.itemKey);
        }}
        selectedKey={props.pageState}
      >
        <PivotItem headerText="View Plan" itemKey="plan" />
        <PivotItem headerText="New Plan" itemKey="new" />
        {userData?.isUserHr && <PivotItem headerText="HR" itemKey="hr" />}
        {userData?.isUserManager && <PivotItem headerText="Line Manager" itemKey="lineManager" />}
        {userData?.isUserGroupHead && <PivotItem headerText="Group Chief" itemKey="gc" />}
        <PivotItem headerText="About" itemKey="about" />
      </Pivot>
    </Stack>
  );
};

export default NavBar;
