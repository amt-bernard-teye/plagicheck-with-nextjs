import { useState, useEffect } from "react";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";
import { AcademicAction } from "@/lib/enums/academic-actions";
import { getFaculties } from "@/lib/api/faculty";
import { FetchForm } from "@/lib/enums/fetch-form";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Faculty } from "@/lib/types/faculty.type";

type DepartmentFormProps = {
  action: AcademicAction;
  onShowAlert: (message: string, variant: AlertVariant) => void;
}

export default function DepartmentForm({action, onShowAlert}: DepartmentFormProps) {
  let [faculties, setFaculties] = useState<Faculty[]>([]);
  let [dataFetched, setDataFetched] = useState(false);
  let [selectedFaculty, setSelectedFaculty] = useState<Faculty | undefined>();


  useEffect(() => {
    async function fetchFaculties() {
      try {
        const result = await getFaculties(FetchForm.ALL);
        setFaculties(result.data);
      }
      catch(error: any) {
        onShowAlert(error.message, AlertVariant.ERROR);
      }
      finally {
        setDataFetched(true);
      }
    }

    if (!dataFetched) {
      fetchFaculties();
    }
  }, [dataFetched]);


  function handleSelectedFaculty(id: number) {
    const faculty = faculties.find(item => item.id === id);
    if (faculty) {
      setSelectedFaculty(faculty);
    }
  }


  let isEditOrAdd = action === AcademicAction.ADD || action === AcademicAction.EDIT;

  return (
    <form>
      {isEditOrAdd ? (
        <>
          <FormGroup className="mb-2">
            <Label htmlFor="department_name">Department Name</Label>
            <FormControl type="text" placeholder="Enter department name here" id="department_name"/>
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="faculty">Select faculty</Label>
            <MultiSelect 
              items={faculties}
              selectedItem={selectedFaculty}
              onSelecteItem={handleSelectedFaculty}
              placeholder="Assign department to a faculty here"/>
          </FormGroup>
          <div className="flex gap-2">
            <div className="col-6 flex flex-column">
              <Button variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button variant="primary" type="submit">Add</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="line-height-24">Are you sure you want to delete this department? This action will remove the department and it cannot be undone</p>
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