import gql from 'graphql-tag';

export const reviewTypeDefs = gql`
  type Review {
    id: ID
    user: User
    car: Car
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    rating: Int!
    comment: String!
    car: ID!
  }

  type Mutation {
    createUpdateReview(reviewInput: ReviewInput!): Review
  }
`;
