"use strict";

const { sqlForPartialUpdate } = require('./sql');

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



// Note to self on toThrow in "throws error: empty data" test

// Idea #1
// const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
// expect(result).toThrow(new Error('No data'));
// Didn't work: we called the function and stored it into results
// before expecting the error

// Idea #2
// expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(new Error('No data'));
// Didn't work: still calls the function prior to the toThrow statement

// // Idea# 3
// function throwError() { sqlForPartialUpdate(dataToUpdate, jsToSql)};
// expect(throwError).toThrow(new Error('No data'));
// Does work: it recognizes it's expecting an error before it throws