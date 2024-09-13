import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";

export default function LecturerForm() {
  return (
    <form>
      <FormGroup className="mb-2">
        <Label>Name</Label>
        <FormControl type="text" placeholder="Enter first and last name" id="full_name"/>
      </FormGroup>
      <FormGroup className="mb-2">
        <Label>Email address</Label>
        <FormControl type="email" placeholder="Eg. johndoe@gmail.com" id="email"/>
      </FormGroup>
      <FormGroup className="mb-2">
        <Label>Phone number</Label>
        <FormControl type="text" placeholder="Enter phone number here" id="phone_number"/>
      </FormGroup>
      <FormGroup className="mb-2">
        <Label>Department</Label>
        <MultiSelect placeholder="Select department" items={[]} onSelecteItem={() => {}} selectedItem={undefined} />
      </FormGroup>
      <FormGroup className="mb-2">
        <Label>Qualification</Label>
        <FormControl type="text" placeholder="Enter qualification here" id="qualification"/>
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
    </form>
  )
}