
/** checkQueryAndFormat is a function that takes an object as an input.
 * This object should represent the query object from the request object in
 * a route.
 * The object is
 */

function checkQueryAndFormat(query) {
  const queryFilters = req.query;

  if (queryFilters?.minEmployees) {
    queryFilters.minEmployees = +queryFilters.minEmployees;
  }

  if (queryFilters?.maxEmployees) {
    queryFilters.maxEmployees = +queryFilters.maxEmployees;
  }

  // Ensures max employees is greater than min employees
  if (queryFilters.minEmployees && queryFilters.maxEmployees) {
    if (queryFilters.minEmployees > queryFilters.maxEmployees) {
      throw new BadRequestError("minEmployees must be less than maxEmployees");
    }
  }
}

module.exports({ checkQueryAndFormat })