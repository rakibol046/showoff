import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUserRound, Lock, Save } from "lucide-react";

export default function Profile() {
  const { data: admin, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPwd }] = useChangePasswordMutation();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const profileForm = useForm();
  const passwordForm = useForm();

  const onProfileSubmit = async (data) => {
    const fd = new FormData();
    if (data.name) fd.append("name", data.name);
    if (data.phone) fd.append("phone", data.phone);
    if (data.profile_picture?.[0]) fd.append("profile_picture", data.profile_picture[0]);
    await updateProfile(fd);
  };

  const onPasswordSubmit = async (data) => {
    await changePassword(data);
    passwordForm.reset();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
          <CircleUserRound className="w-4 h-4" /> Personal Information
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              {avatarPreview || admin?.profile_picture ? (
                <img
                  src={avatarPreview || `http://localhost:8080${admin.profile_picture}`}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <CircleUserRound className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <Label htmlFor="avatar" className="cursor-pointer text-sm text-primary hover:underline">
                  Change photo
                </Label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...profileForm.register("profile_picture")}
                  onChange={(e) => {
                    profileForm.register("profile_picture").onChange(e);
                    if (e.target.files[0]) setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={admin?.name}
                  placeholder="Your name"
                  {...profileForm.register("name")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={admin?.phone}
                  placeholder="Phone number"
                  {...profileForm.register("phone")}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input value={admin?.email || ""} disabled className="mt-1 opacity-60" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <Button type="submit" disabled={updating} className="gap-2">
              <Save className="w-4 h-4" />
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register("currentPassword", { required: true })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register("newPassword", { required: true, minLength: 6 })}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={changingPwd} variant="outline" className="gap-2">
            <Lock className="w-4 h-4" />
            {changingPwd ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
