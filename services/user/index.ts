import { patchRequest, postRequest } from '@/lib/api/calls';
import { UpdateUserPayload, ChangePasswordPayload } from './payload';

export const updateUser = (payload: UpdateUserPayload) => {
  return patchRequest({
    url: '/users/self',
    data: payload,
  });
};

export const changeUserPassword = (payload: ChangePasswordPayload) => {
  return postRequest({
    url: '/auth/change-password',
    data: payload,
  });
};
