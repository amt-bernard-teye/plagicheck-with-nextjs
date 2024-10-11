import * as Yup from "yup";

export const resetValidationSchema = Yup.object({
  newPassword: Yup.string().required("New password is required")
    .min(8, "Must be at least 8 characters")
    .max(16, "Must be 16 characters or less")
    .matches(/^[a-zA-Z0-9@#$%^&*]+[0-9]+[@#$%^&*]+[a-zA-Z0-9@#$%^&*]*$/, "Should contain letters, numbers and symbols"),
  confirmPassword: Yup.string().required("Confirm password is required").test({
    test: (value, ctx) => {
      return value === ctx.parent.newPassword;
    },
    message: "Password do not match each other"
  })
});