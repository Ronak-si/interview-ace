import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type ResetForm = { password: string; confirmPassword: string };

/**
 * Landing page for the recovery email link.
 * Supabase puts a recovery session in place before this renders, so we can
 * simply call updateUser({ password }).
 */
export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ defaultValues: { password: "", confirmPassword: "" } });

  const onSubmit = async (values: ResetForm) => {
    try {
      await updatePassword(values.password);
      toast.success("Password updated");
      void navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password");
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it at least 8 characters long.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="h-11 rounded-xl"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="h-11 rounded-xl"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
