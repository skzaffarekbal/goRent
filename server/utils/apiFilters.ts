import mongoose from 'mongoose';
import geocoder from './geoCoder';
import Booking from '../models/booking.model';
import { DateFilters } from '../types/car.types';

class APIFilters {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  search(query: string) {
    const searchById = {
      _id: query,
    };

    const searchByKeyword = {
      name: {
        $regex: query,
        $options: 'i',
      },
    };

    const searchQuery = query
      ? mongoose.isValidObjectId(query)
        ? searchById
        : searchByKeyword
      : {};

    this.model = this.model.find({ ...searchQuery });
    return this;
  }

  async searchByLocation(locationQuery?: string) {
    let searchQuery = {};

    if (locationQuery) {
      const loc = await geocoder.geocode(locationQuery);
      if (!loc.length) {
        return this;
      }

      const { latitude, longitude } = loc[0];
      const { city, administrativeLevels, streetName, zipcode } = loc[0];
      const { level1long, level1short } = administrativeLevels!;

      if (streetName || zipcode) {
        const radius = 10;
        searchQuery = {
          location: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], radius / 6378.1],
            },
          },
        };
      } else if (city) {
        searchQuery = {
          'location.city': city,
        };
      } else if (level1long || level1short) {
        searchQuery = {
          $or: [{ 'location.state': level1long }, { 'location.stateCode': level1short }],
        };
      }
    }

    this.model = this.model.find(searchQuery);
    return this;
  }

  async availability(dateFilter: DateFilters) {
    const { startDate, endDate } = dateFilter || { startDate: '', endDate: '' };
    const bookedCarsIDs = await Booking.aggregate([
      {
        $match: {
          // Ensure the payment status is not cancelled
          'paymentInfo.status': { $ne: 'cancelled' },

          $or: [
            // Condition 1: Booking overlaps with the search range.
            {
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) },
            },
            // Condition 2: Booking completely covers with search range.
            {
              startDate: { $lte: new Date(startDate) },
              endDate: { $gte: new Date(endDate) },
            },
            // Condition 3: Booking completely within search range
            {
              startDate: { $gte: new Date(startDate) },
              endDate: { $lte: new Date(endDate) },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          bookedCars: { $addToSet: '$car' },
        },
      },
    ]);

    let bookedCarIds = [];
    if (bookedCarsIDs.length) {
      bookedCarIds = bookedCarsIDs[0].bookedCars;
    }

    this.model = this.model.find({ _id: { $nin: bookedCarIds } });
    return this;
  }

  filters(filters: any) {
    let filterCopy = { ...filters };
    let filterStr = JSON.stringify(filterCopy);
    filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.model = this.model.find(JSON.parse(filterStr));
    return this;
  }

  pagination(page: string | number, resPerPage: number) {
    let currentPage = Number(page) || 1;
    let skip = (currentPage - 1) * resPerPage;
    this.model = this.model.limit(resPerPage).skip(skip);
    return this;
  }

  populate(field: string) {
    this.model = this.model.populate(field);
    return this;
  }
}

export default APIFilters;
