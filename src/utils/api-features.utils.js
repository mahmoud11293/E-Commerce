export class ApiFeature {
  constructor(model, query, populate = []) {
    this.model = model;
    // req.query
    this.query = query;
    this.filterObject = {};
    this.paginationObject = {};
    this.populate = populate;
  }

  // pagination
  pagination() {
    const { page = 1, limit = 2 } = this.query;
    const skip = (page - 1) * limit;

    this.paginationObject = {
      limit: parseInt(limit),
      skip,
      page: parseInt(page),
    };

    this.mongooseQuery = this.model.paginate(this.filterObject, {
      ...this.paginationObject,
      populate: this.populate,
    });
    return this;
  }

  // sorting
  sort() {
    const { sort } = this.query;
    if (sort) {
      this.paginationObject.sort = sort;

      this.mongooseQuery = this.model.paginate(this.filterObject, {
        ...this.paginationObject,
        populate: this.populate,
      });
    }
    return this;
  }

  // filtering
  filters() {
    const { page = 1, limit = 2, sort, ...filters } = this.query;

    const filtersAsString = JSON.stringify(filters);
    const replacedFilters = filtersAsString.replace(
      /lt|lte|gt|gte|regex/g,
      (match) => `$${match}`
    );
    this.filterObject = JSON.parse(replacedFilters);

    this.mongooseQuery = this.model.paginate(this.filterObject, {
      ...this.paginationObject,
      populate: this.populate,
    });
    return this;
  }

  // Populate
  populateFields() {
    if (this.populate.length > 0) {
      this.mongooseQuery = this.model.paginate(this.filterObject, {
        ...this.paginationObject,
        populate: this.populate,
      });
    }
    return this;
  }
}
