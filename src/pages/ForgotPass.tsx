import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/Field";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { useMutationForgetPasswordReset } = useMutationAuth();
  const { mutate: ForgotPass, isSuccess, isPending } = useMutationForgetPasswordReset();

  const handleForgotPass = async (email: string) => {
    ForgotPass(email, {
      onSuccess: () => {
        console.log("Password Reset Link sent!")
        setTimeout(() => navigate('/'), 3000)
      }
    });
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a reset link."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleForgotPass(email);
        }}
        className="flex flex-col gap-[18px] md:gap-5"
      >
        <Field
          auth
          id="forgot-email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" size="lg" disabled={isSuccess || isPending} className="mt-2 w-full">
          {isPending ? "Sending…" : isSuccess ? "Link sent" : "Send reset link"}
        </Button>
      </form>
      <Link
        to="/login"
        className="mx-auto flex h-11 items-center gap-1 text-[15px] font-bold text-primary hover:text-primary-hover"
      >
        <ChevronLeft size={18} aria-hidden="true" />
        Back to log in
      </Link>
    </AuthLayout>
  );
};

export default ForgotPass;
