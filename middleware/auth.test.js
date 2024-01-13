"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureIsAdminOrSelf
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
    //TODO: Patterned matched ensureLoggedIn, how does this test work?
    // it's checking that it's not throwing an error
    // basically, testing that nothing happens (no matcher in jest for this!)
    // possibly (to learn whether it works) test toHaveBeenCalled w/ mocks?
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

  //TODO: also test that you're logged in and isAdmin is truthy, but isAdmin isn't true
  // we already have it covered but it's an easy bug to make so it's great to
  // test for it!
})




describe("ensureIsAdminOrSelf", function () {
  test("works: is admin on their own profile", function () {

    const req = { params: { username: "john"} };
    const res = { locals: { user: { username: "john", isAdmin: true} } };

    ensureIsAdminOrSelf(req, res, next);
  });

  test("works: is admin on another user's profile", function () {

    const req = { params: { username: "teresa"} };
    const res = { locals: { user: { username: "john", isAdmin: true} } };

    ensureIsAdminOrSelf(req, res, next);
  });

  test("works: is self (non-admin user acting on themself)", function () {

    const req = { params: { username: "george"} };
    const res = { locals: { user: { username: "george", isAdmin: false} } };

    ensureIsAdminOrSelf(req, res, next);
  });

  test("unauth: non-admin user acting on another user", function() {

    const req = { params: { username: "penelope"} };
    const res = { locals: { user: { username: "george", isAdmin: false} } };

    expect(() => ensureIsAdminOrSelf(req, res, next))
      .toThrow(UnauthorizedError);
  });

  test("unauth: anon acting on a user", function() {

    const req = { params: { username: "penelope"} };
    const res = { locals: {} };

    expect(() => ensureIsAdminOrSelf(req, res, next))
        .toThrow(UnauthorizedError);
  });


  test("unauth: non-admin has truthy isAdmin value (apart from boolea)",
    function() {
      const req = { params: { username: "bob"} };
      const res = { locals: { user: { username: "not_bob", isAdmin: "yes"}} };

      expect(() => ensureIsAdminOrSelf(req, res, next))
          .toThrow(UnauthorizedError);
    });

});