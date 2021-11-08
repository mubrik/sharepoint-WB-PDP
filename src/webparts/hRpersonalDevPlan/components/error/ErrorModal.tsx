import * as React from "react";
import {MessageBar,
  MessageBarType, Stack} from "office-ui-fabric-react";

interface IErrorModalProps {
  children: React.ReactNode;
}

interface IErrorModalState {
  hasError: boolean;
  errorMsg: string;
  errorObj?: Error|null;
}

const initialState = {
  hasError: false,
  errorMsg: "",
  errorObj: null
};

export const ErrorModalContext =
  React.createContext<null|React.Dispatch<React.SetStateAction<IErrorModalState>>>(null);

const ErrorModal = ({children}:IErrorModalProps):JSX.Element => {
  // state
  const [errorState, setErrorState] = React.useState<IErrorModalState>(initialState);

  // effect to log error
  React.useEffect(() => {
    if (errorState.hasError) {
      console.log("error logged", errorState.errorObj);
    }
  }, [errorState.hasError]);

  return(
    <ErrorModalContext.Provider value={setErrorState}>
      {
        errorState.hasError &&
        <Stack>
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => setErrorState(initialState)}
            dismissButtonAriaLabel="Close"
          >
            {errorState.errorMsg}
          </MessageBar>
        </Stack>
      }
      {children}
    </ErrorModalContext.Provider>
  );
};

export default ErrorModal;
