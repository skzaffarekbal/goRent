import gql from 'graphql-tag';

export const CURRENT_USER = gql`
  query CurrentUser {
    me {
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

export const LOGOUT = gql`
  query Logout {
    logout
  }
`;
