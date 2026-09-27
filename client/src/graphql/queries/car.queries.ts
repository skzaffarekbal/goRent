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
