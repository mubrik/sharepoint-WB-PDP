import * as React from "react";
// fabric ui
import {TextField,
  Stack, PrimaryButton,
  Dropdown, mergeStyleSets,
  IDropdownOption, IconButton
} from "office-ui-fabric-react";
import ResponsivePrimaryButton from "../utils/ResponsiveButton";
// components and types
import {IYearControlProps} from "./propTypes";
// notification
import { useNotification } from "../notification/NotificationBarContext";

// styles
const gridCLasses = mergeStyleSets({
  mainGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    overflow: "hidden",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    cursor: "pointer",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
  },
  itemLabel: {
    padding: "5px"
  }
});


const PersonalInfoForm = ({yearData, setYearData, validState, setValidState}: IYearControlProps): JSX.Element => {

  // states
  const [itemsArray, setItemsArray] = React.useState<string[]>([]);
  const [yearOptions, setYearOptions] = React.useState<IDropdownOption[]>([]);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [textField, setTextField] = React.useState("");
  // notify 
  const notify = useNotification();

  // effect for validation
  React.useEffect(() => {
    // items
    const _items = [...itemsArray];
    // not valid
    if (_items.length === 0) {

      setValidState(prevState => ({
        ...prevState,
        yearData: {
          valid: false,
          msg: "Goals for the year can not be empty, add a goal for a year",
          location: "Year-Form"
        }
      }));
    } else {

      setValidState(prevState => ({
        ...prevState,
        yearData: {
          valid: true,
          msg: ""
        }
      }));

    }
  }, [itemsArray]);

  // effect to update item array on mount
  React.useEffect(() => {
    const _items = [...itemsArray];
    // loop over
    Object.keys(yearData).forEach(_year => {
      if (!_items.includes(_year)) {
        _items.push(_year);
      }
    });
    // mutate
    setItemsArray(_items);
  },[yearData]);

  // effect to set years options
  React.useEffect(() => {
    // curr year
    const date = new Date();
    // year string
    const year1 = date.getFullYear() + "";
    const year2 = date.getFullYear() + 1 + "";
    const year3 = date.getFullYear() + 2 + "";
    // loop
    setYearOptions([
      {key: year1, text: year1},
      {key: year2, text: year2},
      {key: year3, text: year3},
    ]);
  }, []);

  // handlers
  const handleAddYearItem = (): void => {
    if (selectedYear === null) return;
    // year
    const _year = selectedYear ? selectedYear.key : null;
    // item array
    const itemArr = [...itemsArray];
    // max is 3 years
    if (itemArr.includes(_year)) {
      notify({msg: `Year goal for ${_year} exists`, type: "info", show: true});
      return;
    }
    // add item
    itemArr.push(_year);
    // set state
    setItemsArray(itemArr);
    // set year data
    setYearData(oldState => ({
      ...oldState,
      [_year]: textField
    }));
    // clear text field
    setTextField("");

  };

  const handleRemoveItem = (param: string): void => {
    // item array
    const itemArr = [...itemsArray];
    const state = {...yearData};
    // filter
    const newArr = itemArr.filter(_year => _year !== param);
    // mutate state
    delete state[param];
    // set state
    setItemsArray(newArr);
    setYearData(state);
  };

  // generate readonly text field
  const generateTextField = (param: string): JSX.Element => {
    return(
      <Stack horizontalAlign="stretch" tokens={{childrenGap: 6, padding: 2}}>
        <TextField key={param} prefix="Year:" value={param} readOnly/>
        <TextField key={param+0} multiline prefix="Goal:" value={yearData[param] as string} readOnly/>
        <ResponsivePrimaryButton 
          type="default"
          text="Clear" 
          iconProps={{iconName: "Clear"}} 
          title="Clear" 
          onClick={() => handleRemoveItem(param)}
        />
      </Stack>
    );
  };

  return(
    <Stack tokens={{childrenGap: 6, padding: 4}}>
      <Stack verticalAlign={"end"} tokens={{childrenGap: 8}}>
        <Dropdown
          options={yearOptions}
          label={"Select Year"}
          selectedKey={selectedYear ? selectedYear.key : undefined}
          onChange={(_, item) => setSelectedYear(item)}
        />
        <TextField
          multiline
          value={textField}
          onChange={(_, newValue) => setTextField(newValue)}
          label={"Goal for the Year"}
          placeholder={"What are your dreams – envision where you would like your career to be at specific point of time."}
        />
        <PrimaryButton
          text={"Add Goal for selected Year"}
          onClick={handleAddYearItem}
          disabled={selectedYear === null || textField === "" || itemsArray.length === 3}
        />
      </Stack>
      <div className={gridCLasses.mainGrid}>
        {
          itemsArray.map(_year => generateTextField(_year))
        }
      </div>
    </Stack>
  );
};

export default PersonalInfoForm;
