"use strict";

/** checkQueryAndFormat is a helper function for the routes/companies/ GET
 *  route.
 *
 *  --INPUT--
 *
 *  It takes an object, query (the req.query from the route) as an input.
 *
 *  Example (note: minEmployees, maxEmployees, and nameLike are all of the
 *  valid options for query keys):
 *
 *  {
 *    minEmployees: "5",
 *    maxEmployees: "10",
 *    nameLike: 'net'
 *  }
 *
 *  --FUNCTION--
 *
 *  This runs a preliminary check on the contents of the query. If
 *  'minEmployees' and/or 'maxEmployees' they get converted to number(s).
 *
 *  If both 'minEmployees' and 'maxEmployees' are provided, it makes sure that
 *  'minEmployees' isn't greater than 'maxEmployees'. (If so, throws a
 *  BadRequestError.)
 *
 *  --OUTPUT--
 *
 *  If queries pass these basic checks, it returns queryFilters, req.query's
 *  contents except strings are converted to numbers as needed.
 *
 *  Example:
 *
 *  {
 *    minEmployees: 5,
 *    maxEmployees: 10,
 *    nameLike: 'net'
 *  }
 *
 *
 */
//TODO: refactor post-test writing
function _checkQueryAndFormat(query) {
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

  return queryFilters;
}

module.exports = { _checkQueryAndFormat }