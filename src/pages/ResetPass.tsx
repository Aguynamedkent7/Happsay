import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import showToast from "@/components/ui/showToast";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/Field";

const ResetPass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use the TanStack Query mutation
  const { useMutationResetPassword } = useMutationAuth();
  const { mutate: resetPassword } = useMutationResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "pwnomatch");
      return;
    }

    if (!token) {
      showToast("Invalid reset password token!", "error");
      return;
    }

    resetPassword(
      { token, password: newPassword, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          setTimeout(() => navigate("/login"), 2000);
        },
      }
    );
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Enter it twice to confirm.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] md:gap-5">
        <PasswordField
          auth
          id="reset-password"
          label="New password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <PasswordField
          auth
          id="reset-confirm-password"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" size="lg" className="mt-2 w-full">
          Save password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPass;
