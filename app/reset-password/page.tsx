import AuthHeader from "@/components/molecules/auth-header";
import ResetPasswordForm from "@/components/organisms/form/ResetPasswordForm";
import Auth from "@/components/templates/auth";

export default function Page() {
  return (
    <Auth>
      <AuthHeader
        heading="Reset Password"
        description="Please enter your new password below"/> 
      <ResetPasswordForm />
    </Auth>
  );
}