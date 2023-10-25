export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type RegisterUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
