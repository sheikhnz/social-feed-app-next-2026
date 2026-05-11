"use client";

import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/antd";
import { Input } from "@/components/ui/antd";
import { Controller } from "react-hook-form";
import { loginAction, signInWithGoogleAction } from "@/app/actions/auth";
import { useAuthForm } from "@/hooks/use-auth-form";
import {
  credentialsSignInSchema,
  CredentialsSignInValues,
} from "@/lib/schemas/sign-in";

const GOOGLE_SIGN_IN_LABEL = "Or sign-in with google";
const OR_LABEL = "Or";
const EMAIL_LABEL = "Email";
const PASSWORD_LABEL = "Password";
const REMEMBER_LABEL = "Remember me";
const FORGOT_LABEL = "Forgot password?";
const SUBMIT_LABEL = "Login now";
const NO_ACCOUNT_TEXT = "Dont have an account?";
const CREATE_ACCOUNT_LABEL = "Create New Account";

export const LoginForm = () => {
  const { form, loading, handleSubmit } = useAuthForm<CredentialsSignInValues>({
    schema: credentialsSignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    action: loginAction,
  });

  const {
    control,
    formState: { errors },
  } = form;

  const renderError = (message?: string) => {
    if (!message) return null;
    return (
      <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
        {message}
      </div>
    );
  };

  return (
    <div className="_auth_content_card">
      <div className="mb-7 text-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Buddy Script"
          width={161}
          height={48}
          className="_auth_logo"
        />
      </div>

      <p className="_auth_subtitle">Welcome back</p>
      <h4 className="_auth_title">Login to your account</h4>

      <button
        type="button"
        className="_google_btn"
        onClick={() => signInWithGoogleAction()}
      >
        <Image
          src="/assets/images/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="_google_icon"
        />
        <span className="_google_btn_text">{GOOGLE_SIGN_IN_LABEL}</span>
      </button>

      <div className="_or_divider">
        <span>{OR_LABEL}</span>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      >
        <div style={{ marginBottom: 14 }}>
          <label
            className="_auth_label"
            style={{ display: "block", marginBottom: 8 }}
          >
            {EMAIL_LABEL}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                size="large"
                autoComplete="email"
                style={{ borderRadius: 6 }}
                status={errors.email ? "error" : ""}
              />
            )}
          />
          {renderError(errors.email?.message)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            className="_auth_label"
            style={{ display: "block", marginBottom: 8 }}
          >
            {PASSWORD_LABEL}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                autoComplete="current-password"
                style={{ borderRadius: 6 }}
                status={errors.password ? "error" : ""}
              />
            )}
          />
          {renderError(errors.password?.message)}
        </div>

        <div className="_auth_form_meta">
          <Checkbox>
            <span style={{ fontSize: 14, color: "var(--bs-color4)" }}>
              {REMEMBER_LABEL}
            </span>
          </Checkbox>
          <button type="button" className="_forgot_link">
            {FORGOT_LABEL}
          </button>
        </div>

        <div style={{ marginBottom: 0 }}>
          <button type="submit" className="_auth_submit_btn" disabled={loading}>
            {loading ? "Signing in…" : SUBMIT_LABEL}
          </button>
        </div>
      </form>

      <div className="_auth_bottom_txt">
        <p>
          {NO_ACCOUNT_TEXT} <Link href="/register">{CREATE_ACCOUNT_LABEL}</Link>
        </p>
      </div>
    </div>
  );
};
