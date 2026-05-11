import type { Metadata } from "next";
import Image from "next/image";
import { AuthBackground } from "@/components/auth/auth-background";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Buddy Script account.",
};

/**
 * Registration page — replicates the registration.html layout.
 */
export default function RegisterPage() {
  return (
    <section className="_social_auth_wrapper">
      <AuthBackground />

      <div
        className="container"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 16px",
          width: "100%",
        }}
      >
        <div className="auth-grid">
          {/* Hero Image — hidden on mobile via `._auth_hero_col` in buddy.css */}
          <div className="_auth_hero_col">
            <Image
              src="/assets/images/registration.png"
              alt="Registration illustration"
              width={560}
              height={480}
              className="_auth_hero_image"
              priority
            />
          </div>

          {/* Form */}
          <div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
