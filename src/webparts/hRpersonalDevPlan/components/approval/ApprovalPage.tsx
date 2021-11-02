import * as React from "react";
// ui
import {Stack, PrimaryButton, ContextualMenu, IContextualMenuProps} from "office-ui-fabric-react";
// context
import {UserContext} from "../HRpersonalDevPlan";
// server
import {fetchServer} from "../../controller/server";
// types
import {IUserData, ISPFullObj} from "../../controller/serverTypes";
import {IStateData, IApprovalProps} from "./propTypes";

const ApprovalPage = ({userType}:IApprovalProps): JSX.Element => {
  // initial data
  const initialData: IStateData = {
    data: [],
    status: "idle"
  };
  // state
  const [stateData, setStateData] = React.useState(initialData);
  // context data
  const {isUserHr, isUserManager, isUserGroupHead, email}: IUserData =
    React.useContext(UserContext);
  // effect to fecth data
  React.useEffect(() => {
    switch (userType) {
      case "hr":
        // do something
        fetchServer.getHrList(email)
          .then(res => {
            console.log(res);
            setStateData({
              data: res,
              status: "loaded"
            });
          });
        break;
      case "gc":
        // do something
        fetchServer.getGroupHeadList(email);
        break;
      case "lineManager":
        // do something
        fetchServer.getLineManagerList(email);
        break;
      default:
        break;
    }
  }, []);
  // generate list
  const generateApprovalItem = (param: ISPFullObj, index: number): JSX.Element => {
    return(
      <div style={{display: "flex"}} key={index}>
        <p>{param.username}</p>
        <p>{param.trainingTitle1}</p>
        <PrimaryButton
          iconProps={{ iconName: 'Add' }}
          menuAs={_getMenu}
          onMenuClick={ev => {
              console.log(ev);
            }}
            menuProps={{
              items: [
                {
                  key: 'emailMessage',
                  text: 'Approve',
                  iconProps: { iconName: 'Mail' }
                },
                {
                  key: 'calendarEvent',
                  text: 'Reject',
                  iconProps: { iconName: 'Calendar' }
                },
                {
                  key: 'viewEvent',
                  text: 'View',
                  iconProps: { iconName: 'Calendar' }
                }
              ],
              directionalHintFixed: true
            }}
        />
      </div>
    );
  };

  const _getMenu = (menuProps: IContextualMenuProps): JSX.Element => {
    // Customize contextual menu with menuAs
    return <ContextualMenu {...menuProps} />;
  };

  return(
    <Stack>
      {
        stateData.status === "loaded" &&
        stateData.data.map((item, index) => generateApprovalItem(item, index))
      }
    </Stack>
  );
};

export default ApprovalPage;
