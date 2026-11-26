import gql from 'graphql-tag';

export const reviewTypeDefs = gql`
  type Review {
    id: ID
    user: User
    car: Car
    rating: Float
    comment: String
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    rating: Float!
    comment: String!
    car: ID!
  }

  type Mutation {
    createUpdateReview(reviewInput: ReviewInput!): Review
  }
`;
