"use strict";

const { sqlForPartialUpdate } = require('./sql');

describe('sqlForPartialUpdate', function () {
  //Test for successful update
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
  //Test for empty data
  test("throws error: empty data", function () {
    const dataToUpdate = {};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    //Option 1
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toThrow(new Error('No data'));
    //Option 2
    // expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(new Error('No data'));
    //Option 3
    // function throwError() { sqlForPartialUpdate(dataToUpdate, jsToSql)};
    // expect(throwError).toThrow(new Error('No data'));
  });
});