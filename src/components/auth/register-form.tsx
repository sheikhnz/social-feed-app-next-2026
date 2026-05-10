"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/antd";
import { Form, Input } from "@/components/ui/antd";

const GOOGLE_REGISTER_LABEL = "Register with google";
const OR_LABEL = "Or";
const EMAIL_LABEL = "Email";
const PASSWORD_LABEL = "Password";
const REPEAT_PASSWORD_LABEL = "Repeat Password";
const TERMS_LABEL = "I agree to terms & conditions";
const SUBMIT_LABEL = "Register now";
const HAVE_ACCOUNT_TEXT = "Already have an account?";
const SIGN_IN_LABEL = "Sign In";

/**
 * Registration form using Ant Design Form, Input, and Button components.
 * Matches the visual design from registration.html exactly.
 */
export const RegisterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    repeatPassword: string;
  }) => {
    setLoading(true);
    try {
      // TODO: wire up registration action
      void values;
    } finally {
      setLoading(false);
    }
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

      <button type="button" className="_google_btn">
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
          rules={[
            { required: true, message: "Please enter a password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
          style={{ marginBottom: 14 }}
        >
          <Input.Password
            size="large"
            autoComplete="new-password"
            style={{ borderRadius: 6 }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="_auth_label">{REPEAT_PASSWORD_LABEL}</span>}
          name="repeatPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          style={{ marginBottom: 14 }}
        >
          <Input.Password
            size="large"
            autoComplete="new-password"
            style={{ borderRadius: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator(_, value) {
                if (value) return Promise.resolve();
                return Promise.reject(new Error("You must accept the terms"));
              },
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Checkbox>
            <span style={{ fontSize: 14, color: "var(--bs-color4)" }}>
              {TERMS_LABEL}
            </span>
          </Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <button type="submit" className="_auth_submit_btn" disabled={loading}>
            {loading ? "Registering…" : SUBMIT_LABEL}
          </button>
        </Form.Item>
      </Form>

      <div className="_auth_bottom_txt">
        <p>
          {HAVE_ACCOUNT_TEXT} <Link href="/login">{SIGN_IN_LABEL}</Link>
        </p>
      </div>
    </div>
  );
};
