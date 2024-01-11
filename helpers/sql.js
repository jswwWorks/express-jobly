"use strict";

const { BadRequestError } = require("../expressError");

/**
 *  --INPUT--
 *
 *  Takes 2 objects: dataToUpdate and jsToSql.
 *
 *  dataToUpdate contains a variable amount of keys about the information
 *  to alter in the database based on a PATCH request.
 *
 *  Example of dataToUpdate contents: {firstName : 'Aliya', age: 32}
 *
 *  jsToSql contains a variable amount of keys. Contains keys with a camelCase
 *  version of a column name and their value is the name in snake_case for
 *  conversion as needed.
 *
 *  Single-worded variables are excluded because no conversion is needed.
 *
 *  Example of jsToSql contents:
 *
*   {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    }
 *
 *  --FUNCTION--
 *
 *  Grabs information from dataToUpdate to determine which columns to UPDATE
 *  in SQL query, along with the new values of those columns.
 *
 *  Column names in dataToUpdate are in camelCase, so it finds the name in
 *  snake_case as needed.
 *
 *  Throws an error if dataToUpdate is empty.
 *
 *  --OUTPUT--
 *
 *  Returns an object with keys 'setCols' and 'values'.
 *
 *  'setCols' is a string of all the columns to update (written in snake_case),
 *  along with a `=$X` for SQL injection prevention.
 *
 *  'values' is an array with each of the values to update in the database.
 *
 *  Example: { setCols: "first_name=$1, age=$2", values: ['Aliya', 32] }
 */
// TODO: What if the user doesn't provide good jsToSql data? No validation
// for this
function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  // Ensures there are at least some changes to make in the database
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Iterates through dataToUpdate keys and creates an array for SQL input
  // sanitization.

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );


  // { setCols: "first_name=$1, age=$2", values: ['Aliya', 32] }
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**
 *  // TODO: if this isn't used elsewhere, take out 'variable amount of keys'
 *  in jsToSqlName description
 *
 * --INPUT--
 *
 *  Takes 3 objects: dataToFilter, jsToSqlName, jsToSqlCondition.
 *  dataToFilter contains a variable amount of keys about the information
 *  to filter the database based on a GET request's query string.
 *
 *  Example of dataToFilter contents: {nameLike : 'net', minEmployees: 4}
 *
 *  jsToSqlName contains a variable amount of keys. Contains keys with a camelCase
 *  version of a column name and their value is the name in snake_case for
 *  conversion as needed.
 *
 *  Example of jsToSqlName contents:
 *
 *  {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    }
 *
 *  jsToSqlOperator maps the js query name to the appropriate SQL operator
 *  to be used in the eventaul WHERE statement of the SQL query.
 *
 * Example of jsToSqlOperator contents:
 *
 *  {
      nameLike: "ILIKE",
      minEmployees: ">=",
      maxEmployees: "<=",
    }
 *
 *  --FUNCTION--
 *
 *  Grabs information from dataToFilter to determines which columns to filter
 *  in SQL query, along with how to filter those columns.
 *
 *  Column names in dataToFilter are in camelCase, so it finds the name in
 *  snake_case as needed.
 *
 *  --OUTPUT--
 *
 *  Returns an object with keys 'filterCols' and 'values'.
 *
 *  'filterCols' is a string of all ways to filter the data,
 *  along with a `=$X` for SQL injection prevention.
 *
 *  'values' is an array with each of the values to update in the database.
 *
 *  Example: { filterCols: "name ILIKE $1 AND num_employees >= $2",
 *             values: ['net', 32] } //FIXME: quotes around columns? in example
*/

// TODO: add %% to part of the value for data sanitization
function sqlWhereFilter(dataToFilter, jsToSqlName, jsToSqlCondition) {

}

module.exports = { sqlForPartialUpdate, sqlWhereFilter };
