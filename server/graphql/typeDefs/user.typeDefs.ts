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

  type Query {
    me: String
  }

  type Mutation {
    registerUser(userInput: UserInput!): User
    login(email: String!, password: String!): User
  }
`;
