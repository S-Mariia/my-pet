import * as Yup from "yup";

export const nutritionDefaultValues = {
  description: '',
};

export const nutritionSchema = Yup.object().shape({
  description: Yup.string()
      .required("Description is required")
})