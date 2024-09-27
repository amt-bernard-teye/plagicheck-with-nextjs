import { FormEvent, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";
import { Department } from "@/lib/types/department.type";
import InputError from "@/components/atoms/input-error/input-error";
import { create, destroy, update } from "@/lib/utils/make-request";
import { UserToCreate } from "@/lib/types/user.type";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Student } from "@/lib/types/student.type";


type StudentFormProps = {
  departments: Department[];
  selectedItem?: Student;
  isDeleteAction?: boolean;
  onSetAlert: (message: string, variant: AlertVariant) => void;
  onAddItem: (value: Student) => void;
  onEditItem?: (value: Student) => void;
  onResetList?: (value: Student[]) => void;
  onToggleModal?: () => void;
}


export default function StudentForm(
  {departments, selectedItem, isDeleteAction, onSetAlert, onAddItem, onEditItem, onResetList, onToggleModal}: StudentFormProps
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [isDepartmentSelected, setIsDepartmentSelected] = useState<"PENDING" | "SELECTED" | "NO_SELECTION">("PENDING");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and white spaces are allowed"),
      email: Yup.string().required("Email is required").email("Invalid email address"),
      phoneNumber: Yup.string().required("Phone is required").matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, "Invalid phone number"),
    }),
    onSubmit: handleSubmit
  });


  useEffect(() => {
    if (selectedItem) {
      formik.setValues({
        name: selectedItem.user.name,
        email: selectedItem.user.email,
        phoneNumber: selectedItem.user.phoneNumber,
      });

      setSelectedDepartment(selectedItem.department);
    }
  }, [selectedItem]);


  function handleSelectedDepartment(id: number) {
    const department = departments.find(dept => dept.id === id);
    setSelectedDepartment(department);
  }


  async function handleSubmit(value: {name: string; email: string; phoneNumber: string}) {
    if (!selectedDepartment) {
      setIsDepartmentSelected("NO_SELECTION");
      return;
    }

    setIsDepartmentSelected("SELECTED");
    setIsSubmitting(true);

    let result: {message: string; data: Student} | undefined;
    let studentToCreate: UserToCreate = {
      ...value,
      departmentId: selectedDepartment!.id!.toString()
    }
    
    try {
      if (!selectedItem) {
        result = await create("/students", studentToCreate);
        onAddItem(result!.data);
      }
      else {
        result = await update(`/students/${selectedItem.user.id}`, studentToCreate);
        if (onEditItem) {
          onEditItem(result!.data);
        }
      }

      onSetAlert(result?.message!, AlertVariant.SUCCESS);
    }
    catch(error) {
      if (error instanceof Error) {
        onSetAlert(error.message, AlertVariant.ERROR);
      }
    }

    setIsDepartmentSelected("PENDING");
    setSelectedDepartment(undefined);
    setIsSubmitting(false);
    formik.resetForm();
  }


  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await destroy(`students/${selectedItem?.user.id}`);
      onSetAlert(result.message, AlertVariant.SUCCESS);
      
      if (onResetList) {
        onResetList(result.data);
      }

      if (onToggleModal) {
        onToggleModal();
      }
    }
    catch(error) {
      if (error instanceof Error) {
        onSetAlert(error.message, AlertVariant.ERROR);
      }
    }
  }


  let submitBtnText = "Add";

  if (isSubmitting) {
    submitBtnText = "Loading...";
  }


  return (
    <form onSubmit={!isDeleteAction ? formik.handleSubmit : handleDeleteSubmit}>
      {!isDeleteAction ? (
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
              {...formik.getFieldProps("email")} hasError={!!formik.errors.email && formik.touched.email} />
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
            <MultiSelect placeholder="Select department" items={departments} onSelecteItem={handleSelectedDepartment} selectedItem={selectedDepartment} />
            {(isDepartmentSelected === "NO_SELECTION") && <InputError message={formik.errors.name} />}
          </FormGroup>

          <div className="flex gap-2 mt-2">
            <div className="col-6 flex flex-column">
              <Button variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button variant="primary" type="submit" disabled={isSubmitting}>{submitBtnText}</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="line-height-24">Are you sure you want to delete {selectedItem?.user.name}? Please remember that this action cannot be undone.</p>
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
  )
}