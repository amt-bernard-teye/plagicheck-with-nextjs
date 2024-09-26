import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";
import InputError from "@/components/atoms/input-error/input-error";
import { Department } from "@/lib/types/department.type";
import { useEffect, useState } from "react";
import { createLecturer } from "@/lib/api/lecturer";
import { LecturerToCreate } from "@/lib/types/user.type";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Lecturer } from "@/lib/types/lecturer.type";
import makeHttpRequest, { HttpMethods } from "@/lib/api/request-sender";
import { StatusCode } from "@/lib/enums/status-code";


type LecturerFormProps = {
  action: "ADD" | "EDIT" | "DELETE";
  departments: Department[];
  selectedItem?: Lecturer;
  onSetAlert: (message: string, status: AlertVariant) => void;
  onAddItem: (value: Lecturer) => void;
  onEditItem?: (lecturer: Lecturer) => void;
}


type LecturerFormData = {
  name: string; 
  email: string; 
  phoneNumber: string; 
  qualification: string;
}


export default function LecturerForm(
  {action, departments, selectedItem, onSetAlert, onAddItem, onEditItem}: LecturerFormProps
) {
  const [chosenDepartment, setChosenDepartment] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      qualification: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and whitespaces are allowed"),
      email: Yup.string().required("Email address is required").email("Invalid email address"),
      phoneNumber: Yup.string().required("Phone number is required").matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, "Invalid phone number"),
      qualification: Yup.string().required("Qualification is required").matches(/^[a-zA-Z ]*$/, "Only letters and whitespaces are allowed")
    }),
    onSubmit: handleSubmit
  });

  
  useEffect(() => {
    if (selectedItem) {
      setSelectedDepartment(selectedItem.department);
      formik.setValues({
        email: selectedItem.user.email,
        name: selectedItem.user.name,
        phoneNumber: selectedItem.user.phoneNumber,
        qualification: selectedItem.qualification,
      });
    }
  }, [selectedItem]);


  async function handleSubmit(value: LecturerFormData) {
    if (!selectedDepartment) {
      setChosenDepartment(false);
      return;
    }

    setChosenDepartment(true);

    let lecturerToCreate: LecturerToCreate = {
      ...value,
      departmentId: selectedDepartment!.id!.toString()
    }

    try {
      if (!selectedItem) {
        const result = await createLecturer(lecturerToCreate);
        onSetAlert(result.message, AlertVariant.SUCCESS);
        onAddItem(result.data);
      } 
      else {
        const result = await makeHttpRequest<LecturerToCreate>({
          method: HttpMethods.PUT,
          path: `lecturers/${selectedItem.user.id}`,
          status: StatusCode.SUCCESS
        }, lecturerToCreate);
        
        onSetAlert(result.message, AlertVariant.SUCCESS);
        if (onEditItem) {
          onEditItem(result.data);
        }
      }

      setSelectedDepartment(undefined);
      formik.resetForm();
    }
    catch(error: any) {
      onSetAlert(error.message, AlertVariant.ERROR);
    }
  }


  function handleSelectedDepartment(id: number) {
    const department = departments.find(item => item.id === id);

    if (!department) {
      return;
    }

    setSelectedDepartment(department);
    setChosenDepartment(true);
  }


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {["ADD", "EDIT"].includes(action) ? (
          <>
            <FormGroup className="mb-2">
              <Label>Name</Label>
              <FormControl type="text" placeholder="Enter first and last name" id="full_name"
                {...formik.getFieldProps("name")} hasError={!!formik.errors.name && formik.touched.name}/>
              {(formik.errors.name && formik.touched.name) && <InputError message={formik.errors.name} />}
            </FormGroup>
            <FormGroup className="mb-2">
              <Label>Email address</Label>
              <FormControl type="email" placeholder="Eg. johndoe@gmail.com" id="email"
                {...formik.getFieldProps("email")} hasError={!!formik.errors.email && formik.touched.email}/>
              {(formik.errors.email && formik.touched.email) && <InputError message={formik.errors.email} />}
            </FormGroup>
            <FormGroup className="mb-2">
              <Label>Phone number</Label>
              <FormControl type="text" placeholder="(000) 000-0000" id="phone_number"
                {...formik.getFieldProps("phoneNumber")} hasError={!!formik.errors.phoneNumber && formik.touched.phoneNumber}/>
              {(formik.errors.phoneNumber && formik.touched.phoneNumber) && <InputError message={formik.errors.phoneNumber} />}
            </FormGroup>
            <FormGroup className="mb-2">
              <Label>Department</Label>
              <MultiSelect 
                placeholder="Select department" 
                items={departments} 
                onSelecteItem={handleSelectedDepartment} 
                selectedItem={selectedDepartment}
                hasError={!chosenDepartment} />
              {!chosenDepartment && <InputError message="Department is required" />}
            </FormGroup>
            <FormGroup className="mb-2">
              <Label>Qualification</Label>
              <FormControl type="text" placeholder="Enter qualification here" id="qualification"
                {...formik.getFieldProps("qualification")} hasError={!!formik.errors.qualification && formik.touched.qualification}/>
              {(formik.errors.qualification && formik.touched.qualification) && <InputError message={formik.errors.qualification} />}
            </FormGroup>

            <div className="flex gap-2 mt-2">
              <div className="col-6 flex flex-column">
                <Button variant="secondary" type="button">Cancel</Button>
              </div>
              <div className="col-6 flex flex-column">
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="line-height-24">Are you sure you want to delete this faculty? This action will remove all departments associated with this faculty, and it cannot be undone</p>
            <div className="flex gap-2 mt-2">
              <div className="col-6 flex flex-column">
                <Button variant="secondary" type="button">Cancel</Button>
              </div>
              <div className="col-6 flex flex-column">
                <Button variant="danger" type="submit">Yes delete</Button>
              </div>
            </div>
          </>
        )}
      </form>
    </>
  )
}