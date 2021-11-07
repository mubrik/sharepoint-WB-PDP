import * as React from "react";
// Ui
import {Dialog, DialogType, DialogFooter,
  PrimaryButton, DefaultButton
} from "office-ui-fabric-react";
// props
interface IDialogProps {
  show: boolean;
  setDialogProps: React.Dispatch<React.SetStateAction<any>>;
  title: string;
  subtitle: string;
  callback: () => void;
  dtype?: string;
}

const DialogOption =
  ({show, setDialogProps, title, subtitle, callback, dtype}:IDialogProps):JSX.Element => {

  const dialogContent = {
    type: dtype === "close" ? DialogType.close : DialogType.normal,
    title,
    subText: subtitle
  };

  const handleCloseDialog = () => {
    setDialogProps(prevValue => {
      return {
          ...prevValue,
          show: false
      };
    });
  };

  return (
    <>
      <Dialog
        hidden={!show}
        onDismiss={handleCloseDialog}
        dialogContentProps={dialogContent}
      >
        <DialogFooter>
          <PrimaryButton text={"Yes"} onClick={() => callback()}/>
          <DefaultButton text={"Cancel"} onClick={handleCloseDialog}/>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default DialogOption;
