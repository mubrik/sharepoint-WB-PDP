// initial form data
export const initialFormData = {
  "year1": "",
  "year2": "",
  "year3": "",
  "strengthWeakness": "",
  "stakeHolder1": "",
  "stakeHolder2": "",
  "stakeHolder3": "",
  "trainingTitle1": "",
  "trainingObjective1": "",
  "trainingDuration1": "",
  "trainingStatus1": "",
  "trainingTitle2": "",
  "trainingObjective2": "",
  "trainingDuration2": "",
  "trainingStatus2": "",
  "trainingTitle3": "",
  "trainingObjective3": "",
  "trainingDuration3": "",
  "trainingStatus3": "",
};


export interface IBaseInputProps {
  data: typeof initialFormData;
  _onChange: (name: string, event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
}
