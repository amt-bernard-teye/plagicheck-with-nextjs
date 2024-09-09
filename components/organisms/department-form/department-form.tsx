import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";

export default function DepartmentForm() {
  return (
    <form>
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
    </form>
  )
}