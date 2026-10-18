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
