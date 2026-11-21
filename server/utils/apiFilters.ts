import mongoose from 'mongoose';
import geocoder from './geoCoder';

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
