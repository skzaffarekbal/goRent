import { gql } from '@apollo/client';

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($userInput: UserInput!) {
    registerUser(userInput: $userInput) {
      id
      name
      email
      phone
      role
      avatar {
        public_id
        url
      }
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_USER_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      name
      phone
      role
      avatar {
        public_id
        url
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($userInput: UpdateUserInput!) {
    updateUserProfile(userInput: $userInput)
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadUserAvatar($avatar: String!) {
    uploadUserAvatar(avatar: $avatar)
  }
`;

export const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPassword($email: String!) {
    forgetPassword(email: $email)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(token: $token, password: $password, confirmPassword: $confirmPassword)
  }
`;
