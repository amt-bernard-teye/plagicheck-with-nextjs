import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";

export default function FacultyForm() {
  return (
    <form>
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
    </form>
  );
}