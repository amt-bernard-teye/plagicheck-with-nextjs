import * as Yup from "yup";

const loginValidationSchema = Yup.object({
  username: Yup.string().required("Email/Staff ID is required").trim(),
  password: Yup.string().required("Password is required").trim()
});

export { loginValidationSchema }