import * as React from "react";
// ui
import {Stack, DefaultButton,
   ContextualMenu, IContextualMenuProps,
   mergeStyleSets
 } from "office-ui-fabric-react";
// context
import {UserContext} from "../HRpersonalDevPlan";
// notification
import useNotificationHook from "../notification/hook";
// server
import {fetchServer} from "../../controller/server";
// types
import {IUserData, ISPFullObj} from "../../controller/serverTypes";
import {IStateData, IApprovalProps} from "./propTypes";
// query
import { useMediaQuery } from "react-responsive";

// styles
const classes = mergeStyleSets({
  itemUsername: {
    padding: "5px",
    margin: "2px 2px"
  },
  itemStatusApproved: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "green",
    textAlign: "center"
  },
  itemStatusPending: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "#117799",
    textAlign: "center"
  },
  itemStatusRejected: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "red",
    textAlign: "center"
  },
  itemButtonContainer: {
    padding: "2px",
    gap: "4px"
  },
  itemShadow: {
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    cursor: "pointer",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
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
  // responsive
  const medium = useMediaQuery({ maxWidth: 940 });
  // notify
  const setNotification = useNotificationHook();
  // effect to fecth data
  React.useEffect(() => {

    if (stateData.status === "idle") {
      // var
      let result:Promise<any[]>;
      // call method based on type of user
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
      result
        .then(res => {
          setStateData({
            data: res,
            status: "loaded"
          });
        })
        .catch(error => {
          setNotification({show: true, isError: true, msg:"Error loading list", errorObj: error});
        });
    }
  }, [stateData.status]);

  // handlers
  const handleApprovalAction = (id: number, param: "Approved"|"Rejected"): void => {
    // call server
    fetchServer.approveRejectEntry(id, userType, param)
    .then(_ => {
      setNotification({show: true, isError: false, msg:"Item status updated"});
      // update state to reload
      setStateData(prevValue => ({
        ...prevValue,
        status: "idle"
      }));
    })
    .catch(error => {
      setNotification({show: true, isError: true, msg:"Error Approving Item", errorObj: error});
    });
  };

  const handleViewClick = (id: number): void => {
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
    // classes
    const statusClass = {
      Approved: classes.itemStatusApproved,
      Pending: classes.itemStatusPending,
      Rejected: classes.itemStatusRejected,
    };

    return(
      <Stack horizontal={medium ? false : true} key={index} className={classes.itemShadow}>
        <Stack.Item shrink={4} grow className={classes.itemUsername}>{param.username}</Stack.Item>
        <p className={statusClass[param.hrManagerStatus]}>HR Status: {param.hrManagerStatus}</p>
        <p className={statusClass[param.lineManagerStatus]}>Line-Manager Status: {param.lineManagerStatus}</p>
        <p className={statusClass[param.gcioStatus]}>GCIO Status: {param.gcioStatus}</p>
        <Stack 
          horizontal
          className={classes.itemButtonContainer}
          horizontalAlign={"space-between"}
        >
          <DefaultButton
            split
            text={"View Plan"}
            onClick={() => handleViewClick(param.Id)}
            iconProps={{ iconName: 'View' }}
            menuAs={_getMenu}
            menuProps={{
              items: [
                {
                  key: 'emailMessage',
                  text: 'Approve',
                  iconProps: { iconName: 'Accept' },
                  onClick: () => handleApprovalAction(param.Id, "Approved")
                },
                {
                  key: 'calendarEvent',
                  text: 'Reject',
                  iconProps: { iconName: 'Cancel' },
                  onClick: () => handleApprovalAction(param.Id, "Rejected")
                }
              ],
              directionalHintFixed: true
            }}
          />
        </Stack>
      </Stack>
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
