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

  type CurrentUserBookings {
    bookings: [Booking]
    totalBookings: Int
    totalUnpaidBookings: Int
    totalAmount: Float
    pagination: Pagination
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

  input PaymentInfoInput {
    id: String
    status: String
    method: String
  }

  input UpdateBookingInput {
    paymentInfo: PaymentInfoInput
  }

  type Query {
    getBookingById(bookingId: String!): Booking!
    getCarBookedDates(carId: String!): [String]!
    myBookings(page: Int, query: String): CurrentUserBookings
  }

  type Mutation {
    createBooking(bookingInput: BookingInput!): Booking!
    updateBooking(bookingId: String!, bookingInput: UpdateBookingInput!): Boolean
  }
`;
