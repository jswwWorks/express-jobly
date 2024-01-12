"use strict";

/**
 * isAdminOrSelf takes in two inputs: username string "username" and user object
 * "user" that is object containing { userName, isAdmin }, where userName is a
 * string and isAdmin is a boolean.
 * Check to see if the user object doesn't a userName matching "username" AND if
 * isAdmin is false. In this case, throws an Unauthorized error.
 * Otherwise returns nothing.
 *
*/

