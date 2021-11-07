import * as React from "react";
// ui
import {Stack, DefaultButton,
   ContextualMenu, IContextualMenuProps,
   mergeStyleSets
 } from "office-ui-fabric-react";
// context
import {UserContext} from "../HRpersonalDevPlan";
// server
import {fetchServer} from "../../controller/server";
// types
import {IUserData, ISPFullObj} from "../../controller/serverTypes";
import {IStateData, IApprovalProps} from "./propTypes";
// styles
const classes = mergeStyleSets({
  itemContainer: {
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    cursor: "pointer",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
  },
  itemUsername: {
    padding: "5px",
    margin: "2px 2px"
  },
  itemStatus: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
  itemButtonContainer: {
    display: "flex",
    marginLeft: "auto"
  }
});

const ApprovalPage = ({userType, setAppData, setMainPageState}:IApprovalProps): JSX.Element => {
  // initial data
  const initialData: IStateData = {
    data: [],
    status: "idle"
  };
  // state
  const [stateData, setStateData] = React.useState(initialData);
  // context data
  const {email}: IUserData =
    React.useContext(UserContext);
  // effect to fecth data
  React.useEffect(() => {
    // var
    let result:Promise<any[]>;

    switch (userType) {
      case "hr":
        // do something
         result = fetchServer.getHrList(email);
        break;
      case "gc":
        // do something
        result = fetchServer.getGroupHeadList(email);
        break;
      case "lineManager":
        // do something
        result = fetchServer.getLineManagerList(email);
        break;
      default:
        break;
    }
    // work on result
    result.then(res => {
      console.log(res);
      setStateData({
        data: res,
        status: "loaded"
      });
    });
  }, []);

  // handlers
  const handleApprovalAction = (id: number, param: "approved"|"rejected") => {
    fetchServer.approveRejectEntry(id, userType, param);
  };

  const handleViewClick = (id: number) => {
    // set app view data
    setAppData(prevValue => ({
      ...prevValue,
      linkedItemId: id,
      viewPageMode: "linked"
    }));
    // switch views
    setMainPageState("plan");
  };

  // generate list item
  const generateApprovalItem = (param: ISPFullObj, index: number): JSX.Element => {
    return(
      <div className={classes.itemContainer} key={index}>
        <p className={classes.itemUsername}>{param.username}</p>
        <p className={classes.itemStatus}>HR Status: {param.hrManagerStatus}</p>
        <p className={classes.itemStatus}>lineManager Status: {param.lineManagerStatus}</p>
        <p className={classes.itemStatus}>gcio Status: {param.gcioStatus}</p>
        <div className={classes.itemButtonContainer}>
          <DefaultButton
            text={"View Plan"}
            onClick={() => handleViewClick(param.Id)}
          />
          <DefaultButton
          iconProps={{ iconName: 'Add' }}
          menuAs={_getMenu}
          menuProps={{
            items: [
              {
                key: 'emailMessage',
                text: 'Approve',
                iconProps: { iconName: 'Accept' },
                onClick: () => handleApprovalAction(param.Id, "approved")
              },
              {
                key: 'calendarEvent',
                text: 'Reject',
                iconProps: { iconName: 'Cancel' },
                onClick: () => handleApprovalAction(param.Id, "rejected")
              },
              {
                key: 'viewEvent',
                text: 'View',
                iconProps: { iconName: 'PreviewLink' }
              }
            ],
            directionalHintFixed: true
          }}
          />
        </div>
      </div>
    );
  };
  // for list generation
  const _getMenu = (menuProps: IContextualMenuProps): JSX.Element => {
    // Customize contextual menu with menuAs
    return <ContextualMenu {...menuProps} />;
  };

  return(
    <Stack>
      {
        stateData.status === "idle" &&
        <div>Loading...</div>
      }
      {
        stateData.status === "loaded" &&
        stateData.data.map((item, index) => generateApprovalItem(item, index))
      }
    </Stack>
  );
};

export default ApprovalPage;
