import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import showToast from "@/components/ui/showToast";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field, PasswordField } from "@/components/ui/Field";

type SignupError = { response?: { data?: Record<string, unknown> } };

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const { useMutationSignup } = useMutationAuth();
  const { mutate: signup, isPending } = useMutationSignup();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const errorMessagesMap: Record<string, string> = {
    username: "Username",
    password: "Password",
    email: "Email",
    confirm_password: "Confirm Password",
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    // Check for empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        const friendlyKey = errorMessagesMap[key] || key;
        errors.push(`${friendlyKey} is required.`);
      }
    });

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Email must be a valid email address.");
    }

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      errors.push(`Passwords do not match.`);
    }

    // Show all errors and stop form submission
    if (errors.length > 0) {
      errors.forEach((error) => showToast(error, "error"));
      return;
    }

    // Proceed with signup request
    signup(formData, {
      onSuccess: (response) => {
        const msg_key = Object.keys(response.data)[0];
        console.log(response.data[msg_key]);
        setTimeout(() => navigate("/login"), 2000);
      },
      onError: (error) => {
        Object.entries((error as SignupError).response?.data ?? {}).forEach(([key, message]) => {
          const friendlyKey = errorMessagesMap[key] || key;
          const errorMessage = Array.isArray(message) ? message.join(", ") : message;
          console.log(`${friendlyKey}: ${errorMessage}`);
        });
      },
    });
  };

  return (
    <AuthLayout variant="signup" title="Create your account" subtitle="Start making planned lists today.">
      <form onSubmit={handleSignup} noValidate className="flex flex-col gap-4 md:gap-5">
        <Field
          auth
          id="signup-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Field
          auth
          id="signup-username"
          name="username"
          label="Username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
        />
        <div className="grid gap-4 md:grid-cols-2 md:gap-3">
          <PasswordField
            auth
            id="signup-password"
            name="password"
            label="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordField
            auth
            id="signup-confirm-password"
            name="confirm_password"
            label="Confirm password"
            autoComplete="new-password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Signing up..." : "Sign up"}
        </Button>
      </form>
      <p className="text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
