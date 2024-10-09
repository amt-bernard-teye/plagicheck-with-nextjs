import AuthHeader from "@/components/molecules/auth-header";
import ForgotPasswordForm from "@/components/organisms/form/forgot-password-form";
import Auth from "@/components/templates/auth";

export default function ForgotPassword() {
  return (
    <Auth>
      <AuthHeader
        heading="Fogot Password"
        description="Please enter your email to receive the reset link in your mail"/> 
      <ForgotPasswordForm />
    </Auth>
  );
}