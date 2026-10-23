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
