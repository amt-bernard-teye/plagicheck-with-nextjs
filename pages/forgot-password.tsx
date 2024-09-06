import Head from "next/head";
import Link from "next/link";

import Auth from "@/components/layouts/auth/Auth";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import Button from "@/components/atoms/button/button";
import SMSTracking from "@/components/atoms/icons/sms-tracking";
import ArrowLeft from "@/components/atoms/icons/arrow-left";
import Alert from "@/components/molecules/alert/alert";
import { useAlert } from "@/lib/hooks/useAlert";
import { AlertVariant } from "@/lib/enums/alert-variant";

export default function ForgotPassword() {
  const { alertDetails, handleAlertDetails } = useAlert();

  return (
    <>
      <Head>
        <title>Plagiarism Checker</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Auth 
        title="Forgot Password"
        description="Please enter your email to receive the reset link in your mail.">
        <form>
          <FormGroup className="mb-2">
            <Label htmlFor="email">Email</Label>
            <FormControl placeholder="Your email" type="email"
              leftIcon={<SMSTracking />}/>
          </FormGroup>
          <div className="flex flex-column gap-2">
            <Button variant="primary" type="submit">Send reset link</Button>
            <Button variant="secondary">
              <ArrowLeft /> Back to login
            </Button>
          </div>
        </form>
      </Auth>

      {alertDetails.message && (
        <Alert 
          details={alertDetails}
          onToggle={() => handleAlertDetails("", AlertVariant.SUCCESS)}/>
      )}
    </>
  );
}
