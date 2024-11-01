import * as Yup from "yup";

const lecturerValidationSchema = Yup.object({
  name: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  email: Yup.string().required().email(),
  phoneNumber: Yup.string().required().matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/),
  qualification: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  departmentId: Yup.string().required().matches(/^[0-9]/)
});


const studentValidationSchema = Yup.object({
  name: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  email: Yup.string().required().email(),
  phoneNumber: Yup.string().required().matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/),
  departmentId: Yup.string().required().matches(/^[0-9]/)
});


export { lecturerValidationSchema, studentValidationSchema };