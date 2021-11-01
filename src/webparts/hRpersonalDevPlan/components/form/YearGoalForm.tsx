import * as React from "react";
// fabric ui
import {TextField,
   Stack, PrimaryButton,
   Dropdown, mergeStyleSets,
   IDropdownOption
 } from "office-ui-fabric-react";

// components and types
import {IYearControlProps,} from "./propTypes";
import ValidationDisplay from "../utils/ValidationDisplay";

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

  // effect for validation
  React.useEffect(() => {
    // items
    let _items = [...itemsArray];
    // not valid
    if (_items.length === 0) {

      setValidState(prevState => ({
        ...prevState,
        yearData: {
          valid: false,
          msg: "Goals for the year cant be empty"
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
    let _items = [...itemsArray];
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
    let date = new Date();
    // year string
    let year1 = date.getFullYear() + "";
    let year2 = date.getFullYear() + 1 + "";
    let year3 = date.getFullYear() + 2 + "";
    // loop
    setYearOptions([
      {key: year1, text: year1},
      {key: year2, text: year2},
      {key: year3, text: year3},
    ]);
  }, []);

  // year options, const for now
  // const yearOptions = [
  //   {key: "2020", text: "2020"},
  //   {key: "2021", text: "2021"},
  //   {key: "2022", text: "2022"},
  // ];

  // handlers
  const handleAddYearItem = () => {
    if (selectedYear === null) return;
    // year
    let _year = selectedYear ? selectedYear.key : null;
    // item array
    let itemArr = [...itemsArray];
    // max is 3 years
    if (itemArr.includes(_year)) {
      return;
    }
    // add item
    itemArr.push(_year);
    // set state
    setItemsArray(itemArr);

    setYearData(oldState => ({
      ...oldState,
      [_year]: textField
    }));

  };

  const handleRemoveItem = (param: string) => {
    // item array
    let itemArr = [...itemsArray];
    let state = {...yearData};
    // filter
    let newArr = itemArr.filter(_year => _year !== param);
    // mutate state
    delete state[param];
    // set state
    setItemsArray(newArr);
    setYearData(state);
  };

  // generate readonly text field
  const generateTextField = (param: string) => {
    return(
      <div className={gridCLasses.itemContainer}>
        <TextField key={param} value={yearData[param] as string} readOnly/>
        <PrimaryButton text={"clear"} onClick={() => handleRemoveItem(param)}/>
      </div>
    );
  };

  return(
    <Stack>
      <ValidationDisplay
        valid={validState.valid}
        msg={validState.msg}
      />
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
          text={"Add Goal"}
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
