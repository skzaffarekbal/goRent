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
      images {
        public_id
        url
      }
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

export const GET_MY_BOOKINGS = gql`
query MyBookings($page: Int, $query: String) {
  myBookings(page: $page, query: $query) {
    bookings {
      amount {
        total
      }
      car {
        id
        name
        images {
          public_id
          url
        }
      }
      startDate
      endDate
      id
      paymentInfo {
        status
      }
      createdAt
    }
    totalUnpaidBookings
    totalBookings
    totalAmount
    pagination {
      resPerPage
      totalCount
    }
  }
}`;
