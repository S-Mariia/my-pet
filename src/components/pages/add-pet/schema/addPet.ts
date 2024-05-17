import * as Yup from "yup";

export const defaultValues = {
  petName: 'Pet',
  type: '',
  size: '',
  birthday: new Date().toString(),
  sex:'',
  weight: ''
};
const langValidate =/^[^\u0400-\u04FF\u0500-\u052F]*$/
export const schema = Yup.object().shape({
  petName: Yup.string().matches(langValidate, "Please use only Latin letters.").required("Pet name is required")
    .max(100, "Pet name is too long, should be less than 100 characters"),
  type: Yup.string().required("Type is required"),
  size: Yup.string().required("Size is required"),
  sex: Yup.string().required("Sex is required"),
  weight: Yup.string().required("Sex is required"),
  birthday: Yup.string().required("Birthday is required")
});
