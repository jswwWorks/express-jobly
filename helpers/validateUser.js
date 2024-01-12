"use strict";

const { UnauthorizedError } = require("../expressError");

// Note: we wanted to make this middleware but we couldn't figure out
// how to pass in the username from the URL


/**
 * isAdminOrSelf takes in two inputs: username string "username" and user object
 * "user" that is object containing { userName, isAdmin }, where userName is a
 * string and isAdmin is a boolean.
 *
 * Check to see if the user object doesn't a userName matching "username" AND if
 * isAdmin is false. In this case, throws an Unauthorized error.
 * Otherwise returns true.
 *
*/
function ensureIsAdminOrSelf(username, user) {
  if (username === user?.username || user?.isAdmin === true) {
    return true;
  }
  throw new UnauthorizedError();
}

module.exports = { ensureIsAdminOrSelf };