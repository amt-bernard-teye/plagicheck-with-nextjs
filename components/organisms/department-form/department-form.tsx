import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";
import { AcademicAction } from "@/lib/enums/academic-actions";

type DepartmentFormProps = {
  action: AcademicAction;
}

export default function DepartmentForm({action}: DepartmentFormProps) {
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
            <Label htmlFor="faculty">Selecte faculty</Label>
            <MultiSelect 
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