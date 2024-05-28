import * as Yup from "yup";

export const defaultValues = {
  name: '',
  email: '',
};
const EMAIL_REGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/

export const schema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name is too long, should be less than 100 characters"),
  email: Yup.string().matches(EMAIL_REGX, 'Invalid email').required('Email is required'),
});
