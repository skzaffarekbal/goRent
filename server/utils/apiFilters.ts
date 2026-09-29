import mongoose from 'mongoose';

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
}

export default APIFilters;
