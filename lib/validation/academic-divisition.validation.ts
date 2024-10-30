import * as Yup from "yup";

const facultyValidationSchema = Yup.object({
  name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and whitespaces are allowed").trim()
});

const departmentValidationSchema = Yup.object({
  name: Yup.string().required("Department name is required")
    .matches(/^[a-zA-Z ]*$/, "Only letters and white spaces are allowed")
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 30 characters or less")
    .trim(),
  facultyId: Yup.string()
    .required("Faculty ID is required")
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .trim(),
});

export { facultyValidationSchema, departmentValidationSchema };