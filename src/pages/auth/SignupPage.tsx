import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Account creation with client-side validation via React Hook Form. */
export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupForm) => {
    try {
      const { needsEmail } = await signUp(
        values.fullName.trim(),
        values.email.trim(),
        values.password,
      );
      if (needsEmail) {
        setEmailSent(true);
        return;
      }
      toast.success("Account created — let's get started!");
      void navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create account");
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Confirm your email"
        subtitle="We sent you a confirmation link. Click it to activate your account, then sign in."
      >
        <div className="glass-card flex items-start gap-3 rounded-2xl p-5">
          <span className="bg-success/12 text-success grid size-10 shrink-0 place-items-center rounded-xl">
            <MailCheck className="size-5" />
          </span>
          <p className="text-muted-foreground text-sm">
            Check your inbox (and spam folder) for the confirmation email. The link brings you
            straight back to your dashboard.
          </p>
        </div>
        <Button asChild className="mt-6 h-11 w-full rounded-xl">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start running AI mock interviews in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            className="h-11 rounded-xl"
            placeholder="Ada Lovelace"
            {...register("fullName", {
              required: "Name is required",
              minLength: { value: 2, message: "Name is too short" },
            })}
          />
          {errors.fullName && <p className="text-destructive text-xs">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 rounded-xl"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <GoogleButton onClick={onGoogle} loading={googleLoading} label="Sign up with Google" />
    </AuthLayout>
  );
}
