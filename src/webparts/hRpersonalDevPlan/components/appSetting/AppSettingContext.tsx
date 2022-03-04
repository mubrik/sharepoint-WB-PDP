// context provider that fetches user, exposes a hook for other comps to get userdata
import * as React from "react";
// server
import {fetchServer} from "../../controller/server";
// types
import { IAppData, IAppDataWithSetState } from "../../types/custom";
// custom context creator
import createContext from "../utils/createContext";
import { useUserData } from "../userContext/UserContext";

// context
const [useAppSettings, AppSettingProvider] = createContext<IAppDataWithSetState>();

// initial app setting
const initialAppSettings: IAppData = {
  draftAvailable: false,
  viewPageMode: "normal",
  linkedItemId: null
};

interface IComponentProps {
  children: React.ReactNode;
}

const AppSettingContext = ({children}: IComponentProps): JSX.Element => {

  const [appSettings, setAppSettings] = React.useState<IAppData>(initialAppSettings);
  // user data
  const { email } = useUserData();

  // effect for app data segtting
  React.useEffect(() => {
    if (email) {
      // get
      fetchServer.userDraftExists(email)
        .then(result => setAppSettings(prevValue => ({
          ...prevValue,
          draftAvailable: result
        })));
    }
  }, [email]);

  const _value = React.useMemo(() => {
    return {
      ...appSettings,
      setAppSettings
    };
  }, [appSettings]);

  return(
    <AppSettingProvider value={_value}>
      {children}
    </AppSettingProvider>
  );
};

export { useAppSettings };
export default AppSettingContext;