"use strict";

const { UnauthorizedError } = require("../expressError");
const { ensureIsAdminOrSelf } = require("./validateUser");

describe("ensureIsAdminOrSelf", function () {
  test("works: is admin on their own profile", function () {

    // the username is req.params.username
    // the user is res.locals.user
    const username = "john";
    const user = { username: "john", isAdmin: true }

    expect(ensureIsAdminOrSelf(username, user)).toEqual(true);
  });

  test("works: is admin on another user's profile", function () {

    const username = "teresa";
    const user = { username: "john", isAdmin: true }

    expect(ensureIsAdminOrSelf(username, user)).toEqual(true);
  });

  test("works: is self (non-admin user acting on themself", function () {

    const username = "george";
    const user = { username: "george", isAdmin: false }

    expect(ensureIsAdminOrSelf(username, user)).toEqual(true);
  });

  test("unauth: non-admin user acting on another user", function() {

    const username = "penelope";
    const user = { username: "george", isAdmin: false }

    expect(() => ensureIsAdminOrSelf(username, user))
      .toThrow(UnauthorizedError);
  });

  test("unauth: anon acting on a user", function() {

    const username = "penelope";
    const user = undefined; // TODO: is this correct?

    expect(() => ensureIsAdminOrSelf(username, user))
        .toThrow(UnauthorizedError);
  });
});