"use strict";

const { sqlForPartialUpdate, sqlWhereFilter } = require('./sql');

describe('sqlForPartialUpdate', function () {

  test('works: non-empty data', function () {
    const dataToUpdate = {
      "firstName": 'Aliya',
      "age": 32
    };
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ['Aliya', 32]
    });
  });

  test("throws error: empty data", function () {
    const dataToUpdate = {};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };

    function throwError() { sqlForPartialUpdate(dataToUpdate, jsToSql)};
    expect(throwError).toThrow(new Error('No data'));
  });
});

describe('sqlWhereFilter', function () {

  test('works: good statements for all possible filters', function() {
    const dataToFilter = {
      nameLike: "net",
      maxEmployees: 45,
      minEmployees: 2
    };
    const jsToSqlName = {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    };
    const jsToSqlOperator =  {
      nameLike: "ILIKE",
      minEmployees: ">=",
      maxEmployees: "<=",
    };

    const result = sqlWhereFilter(dataToFilter, jsToSqlName, jsToSqlOperator);

    expect(result).toEqual({
      setFilters: `name ILIKE '%' || $1 || '%' AND num_employees <= $2 AND num_employees >= $3`,
      values: ['net', 45, 2]
    });
  });

  test('works: good statement for two filters', function() {
    const dataToFilter = {
      maxEmployees: 45,
      nameLike: "net",
    };
    const jsToSqlName = {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    };
    const jsToSqlOperator =  {
      nameLike: "ILIKE",
      minEmployees: ">=",
      maxEmployees: "<=",
    };

    const result = sqlWhereFilter(dataToFilter, jsToSqlName, jsToSqlOperator);

    expect(result).toEqual({
      setFilters: `num_employees <= $1 AND name ILIKE '%' || $2 || '%'`,
      values: [45, 'net']
    });
  });

  test('works: good statement for one filters', function() {
    const dataToFilter = {
      minEmployees: 2
    };
    const jsToSqlName = {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    };
    const jsToSqlOperator =  {
      nameLike: "ILIKE",
      minEmployees: ">=",
      maxEmployees: "<=",
    };

    const result = sqlWhereFilter(dataToFilter, jsToSqlName, jsToSqlOperator);

    expect(result).toEqual({
      setFilters: `num_employees >= $1`,
      values: [2]
    });
  });

  test('works: good statement for one filter with no needed sql name change',
   function() {
    const dataToFilter = {
      min: 2 // min is a dummy variable to test line 152 in sql.js
    };
    const jsToSqlName = {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees",
    };
    const jsToSqlOperator =  {
      nameLike: "ILIKE",
      minEmployees: ">=",
      maxEmployees: "<=",
      min: ">=" // min is a dummy variable to test line 152 in sql.js
    };

    const result = sqlWhereFilter(dataToFilter, jsToSqlName, jsToSqlOperator);

    expect(result).toEqual({
      setFilters: `min >= $1`,
      values: [2]
    });
  });
});
