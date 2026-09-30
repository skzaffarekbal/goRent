import { gql } from '@apollo/client';

export const GET_ALL_CARS = gql`
query GetAllCars($filters: CarFilters, $page: Int, $query: String) {
  getAllCars(filters: $filters, page: $page, query: $query) {
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
    }
    pagination {
      resPerPage
      totalCount
    }
  }
}
`;

export const GET_CAR_BY_ID = gql`
query GetCarById($carId: ID!) {
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
    createdAt
    updatedAt
  }
}
`;
