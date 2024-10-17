import * as Yup from "yup";

const facultyValidationSchema = Yup.object({
  name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and whitespaces are allowed").trim()
});

const departmentValidationSchema = Yup.object({
  name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and whitespaces are allowed").trim(),
  categoryId: Yup.string().required("Category ID is required").matches(/^[0-9]*$/, "Only numbers are allowed").trim(),
});

export { facultyValidationSchema, departmentValidationSchema };