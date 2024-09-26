import * as Yup from "yup";

export const lecturerValidationSchema = Yup.object({
  name: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  email: Yup.string().required().email(),
  departmentId: Yup.number().required(),
  qualification: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  phoneNumber: Yup.string().required().matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
});