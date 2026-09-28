import React, { useState } from "react";
import { Link } from "react-router-dom";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import { IUserData } from "@/interfaces/interfaces";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Field, PasswordField } from "@/components/ui/Field";

const authLink = "font-bold text-primary hover:text-primary-hover";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { useMutationLogin } = useMutationAuth();
  const { mutate: loginUser, isPending } = useMutationLogin();

  const handleLogin = (data: IUserData) => {
    loginUser(data);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see what's on your list.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin({ username, password });
        }}
        className="flex flex-col gap-[18px] md:gap-5"
      >
        <Field
          auth
          id="login-username"
          label="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordField
          auth
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAside={
            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-hover">
              Forgot password?
            </Link>
          }
        />
        <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <p className="text-center text-[15px] text-muted">
        New to Happsay?{" "}
        <Link to="/signup" className={authLink}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
