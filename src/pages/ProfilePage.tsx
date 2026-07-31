import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { EXPERIENCE_LEVELS, INTERVIEW_ROLES } from "@/utils/constants";
import { initials } from "@/utils/format";

type ProfileForm = {
  full_name: string;
  target_role: string;
  experience_level: string;
  bio: string;
};

type PasswordForm = { password: string; confirmPassword: string };

/** Update profile details, change password, sign out. */
export default function ProfilePage() {
  const { profile, user, updateProfile, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      full_name: "",
      target_role: INTERVIEW_ROLES[0],
      experience_level: EXPERIENCE_LEVELS[0],
      bio: "",
    },
  });

  // Reset the form once the profile arrives from the backend.
  useEffect(() => {
    if (!profile) return;
    profileForm.reset({
      full_name: profile.full_name ?? "",
      target_role: profile.target_role ?? INTERVIEW_ROLES[0],
      experience_level: profile.experience_level ?? EXPERIENCE_LEVELS[0],
      bio: profile.bio ?? "",
    });
  }, [profile, profileForm]);

  const passwordForm = useForm<PasswordForm>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSaveProfile = async (values: ProfileForm) => {
    try {
      await updateProfile(values);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your profile");
    }
  };

  const onChangePassword = async (values: PasswordForm) => {
    try {
      await updatePassword(values.password);
      passwordForm.reset({ password: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change password");
    }
  };

  const name = profile?.full_name ?? user?.email ?? "User";

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Manage your account details and security." />

      <section className="glass-card rounded-2xl p-5">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-14 shrink-0">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
            <AvatarFallback className="bg-primary/12 text-primary font-bold">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{name}</p>
            <p className="text-muted-foreground truncate text-sm">{user?.email}</p>
          </div>
        </div>

        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          className="mt-6 grid gap-4 sm:grid-cols-2"
          noValidate
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              className="h-11 rounded-xl"
              {...profileForm.register("full_name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
            {profileForm.formState.errors.full_name && (
              <p className="text-destructive text-xs">
                {profileForm.formState.errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Target role</Label>
            <Select
              value={profileForm.watch("target_role")}
              onValueChange={(value) =>
                profileForm.setValue("target_role", value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Experience</Label>
            <Select
              value={profileForm.watch("experience_level")}
              onValueChange={(value) =>
                profileForm.setValue("experience_level", value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="bio">Short bio</Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="React developer focused on performance and design systems."
              className="rounded-xl"
              {...profileForm.register("bio", {
                maxLength: { value: 280, message: "Keep it under 280 characters" },
              })}
            />
            {profileForm.formState.errors.bio && (
              <p className="text-destructive text-xs">{profileForm.formState.errors.bio.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="gap-2 rounded-xl"
              disabled={profileForm.formState.isSubmitting}
            >
              {profileForm.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserRound className="size-4" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-bold">Change password</h2>
        <p className="text-muted-foreground text-xs">Minimum 8 characters.</p>

        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="mt-5 grid gap-4 sm:grid-cols-2"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              {...passwordForm.register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
            />
            {passwordForm.formState.errors.password && (
              <p className="text-destructive text-xs">
                {passwordForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-xl"
              {...passwordForm.register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordForm.watch("password") || "Passwords do not match",
              })}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="secondary"
              className="gap-2 rounded-xl"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              Update password
            </Button>
          </div>
        </form>
      </section>

      <section className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
        <div>
          <h2 className="text-base font-bold">Sign out</h2>
          <p className="text-muted-foreground text-xs">End your session on this device.</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={async () => {
            await signOut();
            void navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </section>
    </div>
  );
}
