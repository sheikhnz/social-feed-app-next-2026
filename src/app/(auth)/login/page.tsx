import type { Metadata } from "next";
import Image from "next/image";
import { AuthBackground } from "@/components/auth/auth-background";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Buddy Script account.",
};

/**
 * Login page — replicates the login.html layout with hero image and form card.
 */
export default function LoginPage() {
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            alignItems: "center",
            gap: 32,
          }}
          className="auth-grid"
        >
          {/* Hero Image */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/assets/images/login.png"
              alt="Login illustration"
              width={633}
              height={480}
              className="_auth_hero_image"
              priority
            />
          </div>

          {/* Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-grid > div:first-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
