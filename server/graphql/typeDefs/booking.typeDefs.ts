import gql from 'graphql-tag';

export const bookingTypeDefs = gql`
  type Customer {
    name: String!
    phone: String!
    email: String!
  }

  type BookingAmount {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  type PaymentInfo {
    id: String
    status: String
    method: String
  }

  type Booking {
    id: ID!
    car: Car
    user: User
    startDate: String!
    endDate: String!
    customer: Customer!
    amount: BookingAmount!
    daysOfRent: Int!
    rentPerDay: Float!
    paymentInfo: PaymentInfo
    additionalNote: String!
    createdAt: String!
    updatedAt: String!
  }

  input CustomerInput {
    name: String!
    phone: String!
    email: String!
  }

  input BookingAmountInput {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  input BookingInput {
    car: ID!
    startDate: String!
    endDate: String!
    customer: CustomerInput!
    amount: BookingAmountInput!
    daysOfRent: Int!
    rentPerDay: Float!
    additionalNote: String!
  }

#   type Query {}

  type Mutation {
    createBooking(bookingInput: BookingInput!): Booking!
  }
`;
