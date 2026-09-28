import { gql } from '@apollo/client';

export const GET_ALL_CARS = gql`
query GetAllCars {
  getAllCars {
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
