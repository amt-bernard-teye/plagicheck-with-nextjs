import * as Yup from "yup";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email address")
});

export { forgotPasswordValidationSchema };