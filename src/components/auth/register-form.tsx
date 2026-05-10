"use client";

import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/antd";
import { Input } from "@/components/ui/antd";
import { Controller } from "react-hook-form";
import { registerAction, signInWithGoogleAction } from "@/app/actions/auth";
import { useAuthForm } from "@/hooks/use-auth-form";
import { registerSchema, RegisterValues } from "@/lib/schemas/register";

const GOOGLE_REGISTER_LABEL = "Register with google";
const OR_LABEL = "Or";
const EMAIL_LABEL = "Email";
const FIRST_NAME_LABEL = "First Name";
const LAST_NAME_LABEL = "Last Name";
const PASSWORD_LABEL = "Password";
const REPEAT_PASSWORD_LABEL = "Repeat Password";
const TERMS_LABEL = "I agree to terms & conditions";
const SUBMIT_LABEL = "Register now";
const HAVE_ACCOUNT_TEXT = "Already have an account?";
const SIGN_IN_LABEL = "Sign In";

export const RegisterForm = () => {
  const { form, loading, handleSubmit } = useAuthForm<RegisterValues>({
    schema: registerSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      terms: false,
    },
    action: registerAction,
  });

  const { control, formState: { errors } } = form;

  const renderError = (message?: string) => {
    if (!message) return null;
    return <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>{message}</div>;
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

      <p className="_auth_subtitle">Get Started Now</p>
      <h4 className="_auth_title">Registration</h4>

      <button type="button" className="_google_btn" onClick={() => signInWithGoogleAction()}>
        <Image
          src="/assets/images/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="_google_icon"
        />
        <span className="_google_btn_text">{GOOGLE_REGISTER_LABEL}</span>
      </button>

      <div className="_or_divider">
        <span>{OR_LABEL}</span>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
          <div>
            <label className="_auth_label" style={{ display: "block", marginBottom: 8 }}>{FIRST_NAME_LABEL}</label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input {...field} size="large" style={{ borderRadius: 6 }} status={errors.firstName ? "error" : ""} />
              )}
            />
            {renderError(errors.firstName?.message)}
          </div>

          <div>
            <label className="_auth_label" style={{ display: "block", marginBottom: 8 }}>{LAST_NAME_LABEL}</label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input {...field} size="large" style={{ borderRadius: 6 }} status={errors.lastName ? "error" : ""} />
              )}
            />
            {renderError(errors.lastName?.message)}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="_auth_label" style={{ display: "block", marginBottom: 8 }}>{EMAIL_LABEL}</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" size="large" autoComplete="email" style={{ borderRadius: 6 }} status={errors.email ? "error" : ""} />
            )}
          />
          {renderError(errors.email?.message)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="_auth_label" style={{ display: "block", marginBottom: 8 }}>{PASSWORD_LABEL}</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} size="large" autoComplete="new-password" style={{ borderRadius: 6 }} status={errors.password ? "error" : ""} />
            )}
          />
          {renderError(errors.password?.message)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="_auth_label" style={{ display: "block", marginBottom: 8 }}>{REPEAT_PASSWORD_LABEL}</label>
          <Controller
            name="repeatPassword"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} size="large" autoComplete="new-password" style={{ borderRadius: 6 }} status={errors.repeatPassword ? "error" : ""} />
            )}
          />
          {renderError(errors.repeatPassword?.message)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <Controller
            name="terms"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)}>
                <span style={{ fontSize: 14, color: "var(--bs-color4)" }}>
                  {TERMS_LABEL}
                </span>
              </Checkbox>
            )}
          />
          {renderError(errors.terms?.message)}
        </div>

        <div style={{ marginBottom: 0 }}>
          <button type="submit" className="_auth_submit_btn" disabled={loading}>
            {loading ? "Registering…" : SUBMIT_LABEL}
          </button>
        </div>
      </form>

      <div className="_auth_bottom_txt">
        <p>
          {HAVE_ACCOUNT_TEXT} <Link href="/login">{SIGN_IN_LABEL}</Link>
        </p>
      </div>
    </div>
  );
};
