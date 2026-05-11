import { z } from "zod";

/**
 * Shared validation for credentials sign-in (server authorize + client form).
 */
export const credentialsSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export type CredentialsSignInValues = z.infer<typeof credentialsSignInSchema>;
