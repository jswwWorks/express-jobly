"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

function next(err) {
  if (err) throw new Error("Got error from middleware");
}


describe("authenticateJWT", function () {
  test("works: via header", function () {
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    const req = {};
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    const req = {};
    const res = { locals: { user: { username: "test" } } };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    const req = {};
    const res = { locals: {} };
    expect(() => ensureLoggedIn(req, res, next))
        .toThrow(UnauthorizedError);
  });

  test("unauth if no valid login", function () {
    const req = {};
    const res = { locals: { user: { } } };
    expect(() => ensureLoggedIn(req, res, next))
        .toThrow(UnauthorizedError);
  });
});


describe("ensureIsAdmin", function () {

  // shouldn't raise unauthorized for a logged-in admin user
  test("works -- user is an admin, should proceed to next", function () {
    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: true} } }
    ensureIsAdmin(req, res, next);
  });

  test("unauth if no login", function () {
    const req = {};
    const res = { locals: {} };
    expect(() => ensureIsAdmin(req, res, next))
        .toThrow(UnauthorizedError);
  });

  test("unauth if not admin", function () {
    const req = {};
    const res = { locals:
      {
        user:
          {
            username : "test",
            isAdmin : false
          }
      }
    }
    expect(() => ensureIsAdmin(req, res, next))
        .toThrow(UnauthorizedError);
  });

  test("unauth if isAdmin is true but no username provided", function () {
    const req = {};
    const res = { locals:
      {
        user:
          {
            isAdmin : true
          }
      }
    }
    expect(() => ensureIsAdmin(req, res, next))
        .toThrow(UnauthorizedError);
  });


})