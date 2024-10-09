import AuthHeader from "@/components/molecules/auth-header";
import Auth from "@/components/templates/auth";
import LoginForm from "@/components/organisms/login-form";

export default function Home() {
  return (
    <Auth>
      <AuthHeader
        heading="Login"
        description="Please enter your login details below to access your account"/> 
      <LoginForm />
    </Auth>
  );
}
