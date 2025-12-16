import * as yup from "yup";

export const schema = yup.object().shape({
  pet_name: yup
    .string()
    .required("Pet name is required")
    .min(2, "Pet name must be at least 2 characters"),
  type: yup.string().required("Pet type is required"),
  sex: yup.string().required("Sex is required"),
  size: yup.string().required("Size is required"),
  weight: yup.string().required("Weight is required"),
  birthday: yup.string().required("Birthday is required"),
});

export const defaultValues = {
  pet_name: "",
  type: "",
  sex: "",
  size: "",
  weight: "",
  birthday: "",
};
