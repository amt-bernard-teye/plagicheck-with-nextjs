import * as Yup from "yup";

const personalValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required").matches(/^[a-zA-Z]*$/, "Only letters are allowed").trim(),
  lastName: Yup.string().required("Last name is required").matches(/^[a-zA-Z]*$/, "Only letters are allowed").trim(),
  email: Yup.string().required("Email address is required").matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Only letters are allowed").trim(),
  phone: Yup.string().required("Phone is required").matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, "Invalid phone number").trim()
});


const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required').trim(),
  newPassword: Yup.string().required('New password is required')
    .min(8, "Must be 8 characters or more")
    .max(16, "Must be 16 characters or less")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Only letters, numbers and symbols are allowed")
    .trim(),
  confirmPassword: Yup.string().required('Confirm password is required')
    .test({
      test: (value, ctx) => {
        return value === ctx.parent.newPassword;
      },
      message: "Passwords do not match each other"
    })
    .trim(),
});


export { personalValidationSchema, passwordValidationSchema };