import gql from 'graphql-tag';

export const userTypeDefs = gql`
  type Avatar {
    public_id: String
    url: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: [String]
    avatar: Avatar
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    phone: String!
  }

  input UpdateUserInput {
    name: String!
    email: String!
    phone: String!
  }

  type Query {
    me: User
    logout: Boolean
  }

  type Mutation {
    registerUser(userInput: UserInput!): User
    login(email: String!, password: String!): User
    updateUserProfile(userInput: UpdateUserInput!): Boolean
    updatePassword(oldPassword: String!, newPassword: String!): Boolean
    uploadUserAvatar(avatar: String!): Boolean
  }
`;
