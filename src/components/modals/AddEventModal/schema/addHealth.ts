import * as Yup from "yup";

export const defaultValues = {
  date: new Date().toString(),
  description: '',
};

export const schema = Yup.object().shape({
  description: Yup.string()
    .required("Description is required"),
  date:Yup.string().required("Date is required")});
