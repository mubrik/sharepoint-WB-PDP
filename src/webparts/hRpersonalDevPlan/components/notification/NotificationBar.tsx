import * as React from "react";
import {MessageBar,
  MessageBarType, Stack} from "office-ui-fabric-react";

type NotificationType = "error" | "info" | "success" | "warning";
interface INotificationBarProps {
  children: React.ReactNode;
}

export interface INotificationBarState {
  show: boolean;
  msg: string;
  isError?: boolean;
  errorObj?: Error|null;
  type?: NotificationType;
}

const initialState = {
  show: false,
  msg: "",
  isError: false,
  errorObj: null
};

export const NotificationContext =
  React.createContext<null|React.Dispatch<React.SetStateAction<INotificationBarState>>>(null);

const NotificationBar = ({children}:INotificationBarProps):JSX.Element => {
  // state
  const [notifyState, setNotifyState] = React.useState<INotificationBarState>(initialState);

  // effect to log error
  React.useEffect(() => {
    if (notifyState.isError) {
      console.log("error logged", notifyState.errorObj);
    }
  }, [notifyState.isError]);

  return(
    <NotificationContext.Provider value={setNotifyState}>
      {
        notifyState.show &&
        <Stack>
          <MessageBar
            messageBarType={
              notifyState.isError ? MessageBarType.error 
              : notifyState.type === "info" ? MessageBarType.info 
              : notifyState.type === "warning" ? MessageBarType.warning 
              : MessageBarType.success
            }
            isMultiline={false}
            onDismiss={() => setNotifyState(initialState)}
            dismissButtonAriaLabel="Close"
          >
            {notifyState.msg}
          </MessageBar>
        </Stack>
      }
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationBar;
