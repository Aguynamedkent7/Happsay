import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut } from "lucide-react";
import { useUpdateUserProfile } from "@/hooks/tanstack/updateprofile/useMutationUpdateUserProfile";
import Toast from "@/components/ui/ToastContainer";
import { useGetUser } from "@/hooks/tanstack/getuser/useQueryGetUser";
import { IUserData } from "@/interfaces/interfaces";
import showToast from "@/components/ui/showToast";
import { useLogout as logout } from "@/services/auth/authApi";
import { cn } from "@/lib/utils";
import AppShell, { Avatar } from "@/components/AppShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, PasswordField } from "@/components/ui/Field";

const card = "flex flex-col gap-3.5 rounded-2xl border bg-surface p-[18px] md:gap-[18px] md:rounded-[18px] md:p-6";
const cardTitle = "text-lg font-bold";

const SettingsPage: React.FC = () => {
  const userId = Number(localStorage.getItem("userId"));
  const { data: user, isFetching } = useGetUser(userId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUserData>({
    user_id: user?.user_id,
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        user_id: userId,
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  // Update user profile mutation
  const { mutate: updateUserProfile } = useUpdateUserProfile();

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      showToast("User ID not found. Please log in again.", "error");
      return;
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      showToast("Passwords do not match.", "error");
      return;
    }

    updateUserProfile(formData);
  };

  const handleLogout = () =>
    logout(navigate).catch(() => showToast("Couldn't log out. Please try again.", "logout_err"));

  const username: string = user?.username ?? localStorage.getItem("username") ?? "";

  return (
    <AppShell page="settings" className="gap-3.5 md:gap-8">
      <header className="flex flex-col gap-2">
        <Link
          to="/"
          className="hidden w-fit items-center gap-1 text-[15px] font-semibold text-primary hover:text-primary-hover md:flex"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Back to tasks
        </Link>
        <div className="flex items-center gap-4">
          <Avatar name={username} className="size-12 text-xl md:hidden" />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[32px] leading-none font-extrabold tracking-[-0.03em] md:text-5xl">
              Settings
            </h1>
            <p className="text-sm text-muted md:hidden">Signed in as {username}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSaveChanges} className="flex w-full max-w-[640px] flex-col gap-3.5 md:gap-5">
        <section aria-labelledby="profile-heading" className={card}>
          <div className="flex flex-col gap-0.5">
            <h2 id="profile-heading" className={cardTitle}>Profile</h2>
            <p className="text-sm text-muted">Edit a field to change it.</p>
          </div>
          <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
            <Field
              id="settings-username"
              name="username"
              label="Username"
              autoComplete="username"
              placeholder={user?.username}
              value={formData.username}
              onChange={handleChange}
            />
            <Field
              id="settings-email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder={user?.email || "you@example.com"}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </section>

        <section aria-labelledby="password-heading" className={card}>
          <h2 id="password-heading" className={cardTitle}>Password</h2>
          <div className="grid gap-3.5 md:grid-cols-2 md:gap-4">
            <PasswordField
              id="settings-password"
              name="password"
              label="New password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordField
              id="settings-confirm-password"
              name="confirm_password"
              label="Confirm new password"
              autoComplete="new-password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="flex flex-col gap-2 pt-1 md:flex-row md:justify-end md:gap-2.5 md:pt-0">
          <Link to="/" className={cn(buttonVariants({ variant: "secondary" }), "hidden h-[46px] md:inline-flex")}>
            Cancel
          </Link>
          <Button type="submit" size="lg" className="w-full md:h-[46px] md:w-auto">
            {isFetching ? "Loading user data..." : "Save changes"}
          </Button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-12 items-center justify-center gap-2 rounded-xl font-bold text-danger hover:bg-danger/10 md:hidden"
          >
            <LogOut size={18} aria-hidden="true" />
            Log out
          </button>
        </div>
      </form>
      <Toast />
    </AppShell>
  );
};

export default SettingsPage;
