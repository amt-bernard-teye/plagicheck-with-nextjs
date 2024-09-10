import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import { AcademicAction } from "@/lib/enums/academic-actions";

type FacultyFormProps = {
  action: AcademicAction;
}

export default function FacultyForm({ action }: FacultyFormProps) {
  let isEditOrAdd = action === AcademicAction.ADD || action === AcademicAction.EDIT;

  return (
    <form>
      {isEditOrAdd ? (
        <>
          <FormGroup>
            <Label htmlFor="faculty_name">Faculty Name</Label>
            <FormControl type="text" placeholder="Enter faculty name here" id="faculty_name"/>
          </FormGroup>
          <div className="flex gap-2 mt-2">
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
  );
}