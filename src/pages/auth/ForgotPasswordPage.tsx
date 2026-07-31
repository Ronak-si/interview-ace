import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type ForgotForm = { email: string };

/** Sends a password recovery link that lands on /reset-password. */
export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ defaultValues: { email: "" } });

  const onSubmit = async (values: ForgotForm) => {
    try {
      await sendPasswordReset(values.email.trim());
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the reset email");
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send a recovery link."
      footer={
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="glass-card flex items-start gap-3 rounded-2xl p-5">
          <span className="bg-success/12 text-success grid size-10 shrink-0 place-items-center rounded-xl">
            <MailCheck className="size-5" />
          </span>
          <p className="text-muted-foreground text-sm">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
