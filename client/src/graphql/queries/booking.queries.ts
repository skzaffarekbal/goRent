import { gql } from '@apollo/client';

export const GET_BOOKING_BY_ID = gql`
query GetBookingById($bookingId: String!) {
  getBookingById(bookingId: $bookingId) {
    id
    additionalNote
    amount {
      discount
      rent
      tax
      total
    }
    car {
      id
      name
    }
    customer {
      email
      name
      phone
    }
    daysOfRent
    paymentInfo {
      id
      method
      status
    }
    rentPerDay
    startDate
    endDate
    # user {
    #   id
    #   name
    #   phone
    # }
    createdAt
    updatedAt
  }
}
`;
