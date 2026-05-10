"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/antd";
import { Form, Input } from "@/components/ui/antd";

const GOOGLE_SIGN_IN_LABEL = "Or sign-in with google";
const OR_LABEL = "Or";
const EMAIL_LABEL = "Email";
const PASSWORD_LABEL = "Password";
const REMEMBER_LABEL = "Remember me";
const FORGOT_LABEL = "Forgot password?";
const SUBMIT_LABEL = "Login now";
const NO_ACCOUNT_TEXT = "Dont have an account?";
const CREATE_ACCOUNT_LABEL = "Create New Account";

/**
 * Login form using Ant Design Form, Input, and Button components.
 * Matches the visual design from login.html exactly.
 */
export const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // TODO: wire up Auth.js signIn
      void values;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="_auth_content_card">
      <div className="text-center mb-7">
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

      <button type="button" className="_google_btn">
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      >
        <Form.Item
          label={<span className="_auth_label">{EMAIL_LABEL}</span>}
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
          style={{ marginBottom: 14 }}
        >
          <Input
            type="email"
            size="large"
            autoComplete="email"
            style={{ borderRadius: 6 }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="_auth_label">{PASSWORD_LABEL}</span>}
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
          style={{ marginBottom: 14 }}
        >
          <Input.Password size="large" autoComplete="current-password" style={{ borderRadius: 6 }} />
        </Form.Item>

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

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            type="submit"
            className="_auth_submit_btn"
            disabled={loading}
          >
            {loading ? "Signing in…" : SUBMIT_LABEL}
          </button>
        </Form.Item>
      </Form>

      <div className="_auth_bottom_txt">
        <p>
          {NO_ACCOUNT_TEXT}{" "}
          <Link href="/register">{CREATE_ACCOUNT_LABEL}</Link>
        </p>
      </div>
    </div>
  );
};
