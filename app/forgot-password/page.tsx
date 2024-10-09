import AuthHeader from "@/components/molecules/auth-header";
import ForgotPasswordForm from "@/components/organisms/form/forgot-password-form";
import Auth from "@/components/templates/auth";

export default function ForgotPassword() {
  return (
    <Auth>
      <AuthHeader
        heading="Login"
        description="Please enter your login details below to access your account"/> 
      <ForgotPasswordForm />
    </Auth>
  );
}