"use strict";

const { _checkQueryAndFormat } = require('./queryValidation');

describe("_checkQueryAndFormat", function () {


  test('works: all 3 queries provided and min is less than max', function () {
    const query = {
      minEmployees: "5",
      maxEmployees: "10",
      nameLike: "net"
    }
    const result = _checkQueryAndFormat(query);

    expect(result).toEqual({
      minEmployees: 5,
      maxEmployees: 10,
      nameLike: "net"
    })
  })

  // Test error for bad input with min and max values

});