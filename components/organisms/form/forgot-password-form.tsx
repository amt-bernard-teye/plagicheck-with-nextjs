import Button from "@/components/atoms/button";
import FormControl from "@/components/atoms/form-control";
import FormGroup from "@/components/atoms/form-group";
import ArrowLeft from "@/components/atoms/icons/arrow-left";
import SMSTracking from "@/components/atoms/icons/sms-tracking";
import Label from "@/components/atoms/label";

export default function ForgotPasswordForm() {
  return (
    <form>
      <FormGroup className="space-y-1 my-4">
        <Label>Email</Label>
        <FormControl
          leftIcon={<SMSTracking />}
          type="email"
          placeholder="Your email" />
      </FormGroup>
      <div className="flex flex-col gap-4">
        <Button el="button" variant="primary" disabled={true}>Send reset link</Button>
        <Button el="button" variant="secondary">
          <ArrowLeft/> Back to login
        </Button>
      </div>
    </form>
  );
}