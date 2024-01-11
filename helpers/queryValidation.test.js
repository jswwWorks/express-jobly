"use strict";

const { _checkQueryAndFormat } = require('./queryValidation');

describe("_checkQueryAndFormat", function () {
  test('works: all 3 queries provided and min is less than max', function () {
    const query = {
      minEmployees: "5",
      maxEmployees: "10",
      nameLike: "net"
    };
    const result = _checkQueryAndFormat(query);

    expect(result).toEqual({
      minEmployees: 5,
      maxEmployees: 10,
      nameLike: "net"
    });
  });
  test('fails: minEmployees passed into query with a non number value', function () {
    const query = {
      minEmployees: "test",
      maxEmployees: "10",
      nameLike: "net"
    };

    expect(() => _checkQueryAndFormat(query)).toThrow(
      new Error("minEmployees must be a number!")
    );
  });
  test('fails: maxEmployees passed into query with a non number value', function () {
    const query = {
      minEmployees: "5",
      maxEmployees: "test",
      nameLike: "net"
    };

    expect(() => _checkQueryAndFormat(query)).toThrow(
      new Error("maxEmployees must be a number!")
    );
  });
  test('fails: minEmployees greater than maxEmployees', function () {
    const query = {
      minEmployees: "10",
      maxEmployees: "5",
      nameLike: "net"
    };

    expect(() => _checkQueryAndFormat(query)).toThrow(
      new Error("minEmployees must be less than maxEmployees")
    );
  });
});