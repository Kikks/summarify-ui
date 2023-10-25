export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
