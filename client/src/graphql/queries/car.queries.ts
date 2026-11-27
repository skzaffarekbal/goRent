import { gql } from '@apollo/client';

export const GET_ALL_CARS = gql`
query GetAllCars($filters: CarFilters, $page: Int, $query: String, $location: String, $dateFilters: DateFilters) {
  getAllCars(filters: $filters, page: $page, query: $query, location: $location, dateFilters: $dateFilters) {
    cars {
      id
      name
      category
      rentPerDay
      transmission
      fuelType
      images {
        public_id
        url
      }
      ratings {
        count
        value
      }
      address
      location {
        coordinates
      }
    }
    pagination {
      resPerPage
      totalCount
    }
  }
}
`;

export const GET_CAR_BY_ID = gql`
query GetCarById($carId: ID!, $getCarBookedDatesCarId2: String!, $canReviewCarId: ID!) {
  getCarById(carId: $carId) {
    id
    name
    description
    brand
    doors
    fuelType
    year
    transmission
    status
    seats
    rentPerDay
    mileage
    power
    category
    address
    ratings {
      count
      value
    }
    images {
      public_id
      url
    }
    reviews {
      id
      user {
        id
        name
        avatar { 
          public_id
          url 
        }
      }
      rating
      comment
      updatedAt
    }
    createdAt
    updatedAt
  }
  getCarBookedDates(carId: $getCarBookedDatesCarId2)
  canReview(canReviewCarId: $canReviewCarId)
}
`;
