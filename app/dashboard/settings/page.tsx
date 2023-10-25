'use client';
import CustomScrollbar from '@/components/custom-scrollbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toaster from '@/lib/toaster';
import { changeUserPassword, updateUser } from '@/services/user';
import { Label } from '@radix-ui/react-label';
import { useMutation } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

const Settings = () => {
  const { data, update } = useSession();
  const [profileDetails, setProfileDetails] = useState({
    firstName: data?.user?.firstName || '',
    lastName: data?.user?.lastName || '',
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const { mutate: updateUserMutate, isPending: isUpdateUserPending } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: async (response) => {
        if (response?.data) {
          try {
            await update((prev: any) => ({
              ...prev,
              user: {
                firstName: response?.data?.firstName,
                lastName: response?.data?.lastName,
              },
            }));
            toaster.success({
              message: 'Profile updated successfully',
            });
          } catch (error) {
            console.log(error);
          }
        }
      },
    });

  const { mutate: changePasswordMutate, isPending: isChangePasswordPending } =
    useMutation({
      mutationFn: changeUserPassword,
      onSuccess: async () => {
        try {
          setPasswordDetails({
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          await signOut({ redirect: true, callbackUrl: '/auth/login' });
        } catch (error) {
          console.log(error);
        }
      },
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangePasswordDetails = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfileDetails = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (
      profileDetails.firstName.trim() === '' ||
      profileDetails.lastName.trim() === ''
    ) {
      toaster.error({
        message: 'Please fill all the fields',
      });
      return;
    }

    updateUserMutate(profileDetails);
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      passwordDetails.oldPassword.trim() === '' ||
      passwordDetails.newPassword.trim() === '' ||
      passwordDetails.confirmNewPassword.trim() === ''
    ) {
      toaster.error({
        message: 'Please fill all the fields',
      });
      return;
    }

    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      toaster.error({
        message: 'New password and confirm new password do not match',
      });
      return;
    }

    changePasswordMutate({
      oldPassword: passwordDetails.oldPassword,
      newPassword: passwordDetails.newPassword,
    });
  };

  return (
    <CustomScrollbar className="w-full flex-1">
      <main className="flex-col space-y-10 p-5 xl:p-10">
        <Tabs defaultValue="profile" className="w-full space-y-10">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <form
              className="flex w-full max-w-[600px] flex-col space-y-5"
              onSubmit={handleUpdateProfileDetails}
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  name="firstName"
                  placeholder="Enter your first name"
                  required
                  value={profileDetails.firstName}
                  onChange={handleChange}
                  disabled={isUpdateUserPending}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  name="lastName"
                  placeholder="Enter your last name"
                  required
                  value={profileDetails.lastName}
                  onChange={handleChange}
                  disabled={isUpdateUserPending}
                />
              </div>

              <Button className="!mt-10 w-full" disabled={isUpdateUserPending}>
                {isUpdateUserPending ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="account">
            <form
              className="flex w-full max-w-[600px] flex-col space-y-5"
              onSubmit={handleChangePassword}
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  type="password"
                  name="oldPassword"
                  placeholder="Enter your old password"
                  required
                  value={passwordDetails.oldPassword}
                  onChange={handleChangePasswordDetails}
                  disabled={isChangePasswordPending}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  required
                  value={passwordDetails.newPassword}
                  onChange={handleChangePasswordDetails}
                  disabled={isChangePasswordPending}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="confirmNewPassword">
                  Re-enter New Password
                </Label>
                <Input
                  type="password"
                  name="confirmNewPassword"
                  placeholder="Re-enter your new password"
                  required
                  value={passwordDetails.confirmNewPassword}
                  onChange={handleChangePasswordDetails}
                  disabled={isChangePasswordPending}
                />
              </div>

              <Button
                className="!mt-10 w-full"
                disabled={isChangePasswordPending}
              >
                {isChangePasswordPending ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </CustomScrollbar>
  );
};

export default Settings;
