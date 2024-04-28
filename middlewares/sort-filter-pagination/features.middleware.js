const paginatedResults = model => {
  return async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
      currentPage: {
        page: page,
        limit: limit
      }
    };

    const totalCount = await model.countDocuments().exec();

    results.totalDocs = totalCount;
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.totalPages = Math.ceil(totalCount / limit);
    results.lastPage = Math.ceil(totalCount / limit);

    // Sort
    const sort = {};
    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] = req.query.OrderBy.toLowerCase() === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Filter
    let filter = {};
    if (req.query.filterBy && req.query.role) {
      if (req.query.role.toLowerCase() === 'admin') {
        filter.$or = [{ role: 'admin' }];
      } else if (req.query.role.toLowerCase() === 'user') {
        filter.$or = [{ role: 'user' }];
      } else if (req.query.role.toLowerCase() === 'all') {
        filter = {};
      }
    }

    // Search
    if (req.query.search) {
      filter = {
        $or: [
          { firstName: { $regex: req.query.search } },
          { lastName: { $regex: req.query.search } },
          { email: { $regex: req.query.search } },
          { gender: { $regex: req.query.search } },
          { role: { $regex: req.query.search } },
          { dateOfBirth: { $regex: req.query.search } }
        ]
      };
    }

    try {
      results.results = await model
        .find(filter)
        .select(' firstName lastName email dateOfBirth gender cart createdAt updatedAt 	role')
        .limit(limit)
        .sort(sort)
        .skip(startIndex)
        .exec();

      // Add paginated Results to the request
      res.paginatedResults = results;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = paginatedResults;
