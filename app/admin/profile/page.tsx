"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { changePasswordClient } from "@/app/actions/client-auth";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  workStart: z.string().optional().or(z.literal("")),
  workEnd: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ProfileForm = z.infer<typeof ProfileSchema>;
type PasswordForm = z.infer<typeof PasswordSchema>;

export default function AdminProfilePage() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      department: "",
      position: "",
      workStart: "",
      workEnd: "",
      bio: "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!userData) return;
    form.reset({
      name: userData.name || "",
      email: userData.email || "",
      phone: (userData as any).phone || "",
      address: (userData as any).address || "",
      department: (userData as any).department || "",
      position: (userData as any).position || "",
      workStart: (userData as any).workStart || "",
      workEnd: (userData as any).workEnd || "",
      bio: (userData as any).bio || "",
    });
  }, [userData, form]);

  const onSubmit = async (values: ProfileForm) => {
    if (!user?.uid) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, updates: {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          address: values.address || null,
          department: values.department || null,
          position: values.position || null,
          workStart: values.workStart || null,
          workEnd: values.workEnd || null,
          bio: values.bio || null,
        } }),
      });
      const json = await res.json();
      if (json?.success) {
        toast({ title: "Profile updated", description: "Your information has been saved." });
        setIsEditing(false);
      } else {
        toast({ title: "Update failed", description: json?.message ?? "Please try again.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (userData) {
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        phone: (userData as any).phone || "",
        address: (userData as any).address || "",
        department: (userData as any).department || "",
        position: (userData as any).position || "",
        workStart: (userData as any).workStart || "",
        workEnd: (userData as any).workEnd || "",
        bio: (userData as any).bio || "",
      });
    }
  };

  const onChangePassword = async (values: PasswordForm) => {
    setIsChangingPassword(true);
    try {
      const result = await changePasswordClient(values.currentPassword, values.newPassword);
      if (result.success) {
        toast({ title: "Password updated", description: "Your password has been changed." });
        passwordForm.reset();
      } else {
        toast({ title: "Update failed", description: result.message, variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Update your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Make changes to your account here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Juan Dela Cruz" disabled={!isEditing} {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="09xx xxx xxxx" disabled={!isEditing} {...form.register("phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="City, Province" disabled={!isEditing} {...form.register("address")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Department" disabled={!isEditing} {...form.register("department")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" placeholder="Position" disabled={!isEditing} {...form.register("position")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workStart">Work Start</Label>
              <Input id="workStart" type="time" disabled={!isEditing} {...form.register("workStart")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workEnd">Work End</Label>
              <Input id="workEnd" type="time" disabled={!isEditing} {...form.register("workEnd")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} placeholder="Tell us about yourself" disabled={!isEditing} {...form.register("bio")} />
          </div>

          <div className="flex justify-end gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="At least 6 characters" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Repeat new password" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={passwordForm.handleSubmit(onChangePassword)} disabled={isChangingPassword} className="bg-primary hover:bg-primary/90">
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


