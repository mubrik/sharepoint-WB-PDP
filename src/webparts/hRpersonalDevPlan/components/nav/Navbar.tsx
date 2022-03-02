import * as React from "react";
import { 
  Stack, Pivot,
  PivotItem, DefaultButton,
  IContextualMenuProps, mergeStyleSets
} from "office-ui-fabric-react";
//context
import {UserContext} from "../HRpersonalDevPlan";
// types
import {IUserData} from "../../controller/serverTypes";
// query
import { useMediaQuery } from "react-responsive";

// styles
const classes = mergeStyleSets({
  navButton : {
    width: "100%",
  }
});

export interface IProps {
  pageState: string;
  setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar: React.FunctionComponent<IProps> = ({ pageState, setPageState }: IProps) => {
  // user data
  const userData:IUserData = React.useContext(UserContext);
  // responsive
  const medium = useMediaQuery({ maxWidth: 600 });
  // nav button menu props
  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'viewPlan',
        text: 'View Plan',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("plan")
      },
      {
        key: 'newPlan',
        text: 'New Plan',
        iconProps: { iconName: 'NewTeamProject' },
        onClick: () => setPageState("new")
      },
      userData?.isUserHr && {
        key: 'HR',
        text: 'HR',
        iconProps: { iconName: 'DocumentApproval' },
        onClick: () => setPageState("hr")
      },
      userData?.isUserManager && {
        key: 'lineManager',
        text: 'Line Manager',
        iconProps: { iconName: 'DocumentApproval' },
        onClick: () => setPageState("lineManager")
      },
      userData?.isUserGroupHead && {
        key: 'gc',
        text: 'Group Chief',
        iconProps: { iconName: 'DocumentApproval' },
        onClick: () => setPageState("gc")
      },
    ],
  };

  return (
    <Stack>
      {
        medium ?
        <Stack.Item>
          <DefaultButton
            text="MENU"
            iconProps={{iconName: "CollapseMenu"}}
            menuProps={menuProps}
            className={classes.navButton}
          /> 
        </Stack.Item> :
        <Pivot
          aria-label={"pivot"}
          onLinkClick={(item) => {
            setPageState(item.props.itemKey);
          }}
          selectedKey={pageState}
        >
          <PivotItem headerText="View Plan" itemKey="plan" />
          <PivotItem headerText="New Plan" itemKey="new" />
          {userData?.isUserHr && <PivotItem headerText="HR" itemKey="hr" />}
          {userData?.isUserManager && <PivotItem headerText="Line Manager" itemKey="lineManager" />}
          {userData?.isUserGroupHead && <PivotItem headerText="Group Chief" itemKey="gc" />}
          <PivotItem headerText="About" itemKey="about" />
        </Pivot>
      }
    </Stack>
  );
};

export default NavBar;
