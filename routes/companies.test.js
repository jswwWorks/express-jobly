"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const Company = require('../models/company');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /companies", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    logoUrl: "http://new.img",
    description: "DescNew",
    numEmployees: 10,
  };

  test("unauthorized for non-admins", async function () {
    const resp = await request(app)
        .post("/companies")
        .send(newCompany)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {message: "Unauthorized", status: 401},
    });
  });

  test("ok for admin users", async function () {
    const resp = await request(app)
        .post("/companies")
        .send(newCompany)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      company: newCompany,
    });
  });

  test("bad request with missing data for admin", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          handle: "new",
          numEmployees: 10,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  //TODO: Is below redundent?
  test("unauth with missing data for non-admin", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          handle: "new",
          numEmployees: 10,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
  test("bad request with invalid data for admin", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          ...newCompany,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  //TODO: Is below redundent?
  test("unauth with invalid data for non-admin", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          ...newCompany,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** GET /companies */

describe("GET /companies", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({
      companies:
          [
            {
              handle: "c1",
              name: "C1",
              description: "Desc1",
              numEmployees: 1,
              logoUrl: "http://c1.img",
            },
            {
              handle: "c2",
              name: "C2",
              description: "Desc2",
              numEmployees: 2,
              logoUrl: "http://c2.img",
            },
            {
              handle: "c3",
              name: "C3",
              description: "Desc3",
              numEmployees: 3,
              logoUrl: "http://c3.img",
            },
          ],
    });
  });
  // TODO: We have a question about running this below all the other tests,
  // ignores the Company.findAllFiltered and uses mock instead.
  test("ok sending query and returning correct companies", async function () {
    const resp = await request(app).get(
      "/companies?minEmployees=1&maxEmployees=2&nameLike=C"
    );
    //TODO: Can chain the .query method off the .get() and pass the query as an
    // object for better readability.
    expect(resp.body).toEqual({
      companies:
          [
            {
              handle: "c1",
              name: "C1",
              description: "Desc1",
              numEmployees: 1,
              logoUrl: "http://c1.img",
            },
            {
              handle: "c2",
              name: "C2",
              description: "Desc2",
              numEmployees: 2,
              logoUrl: "http://c2.img",
            },
          ],
    });
  });

  test("ok finding all companies without any filters provided",
  async function () {

    // Set Company.findAll to a jest.fn()
    Company.findAll = jest.fn();

    Company.findAll.mockReturnValue(["No Filter"]);
    // TODO: Could use toHaveBeenCalled (? Check actual syntax) that is a jest
    // method to test if a function has been called.
    const resp = await request(app).get('/companies');
    expect(resp.body).toEqual({companies: ["No Filter"]});

  });

  test("ok finding all filtered companies when a valid filter is provided",
   async function() {
      // Set Company.findAllFiltered to a jext.fn()
      Company.findAllFiltered = jest.fn(); // error here

      Company.findAllFiltered.mockReturnValue(["Filtered Company"]);
      // TODO: Could use toHaveBeenCalled (? Check actual syntax) that is a jest
      // method to test if a function has been called.
      const resp = await request(app).get('/companies?maxEmployees=1');
      expect(resp.body).toEqual({companies: ["Filtered Company"]});

    });

  test("query string is not valid", async function () {
    // TODO: Make it more clear about WHY query is invalid
    const resp = await request(app).get('/companies?test=fail');
    expect(resp.status).toEqual(400);
  });

  test("query string has minEmployees > maxEmployees", async function () {
    const resp = await request(app).get(
      '/companies?minEmployees=2&maxEmployees=1'
    );
    expect(resp.body).toEqual({
      "error": {
        "message": "minEmployees must be less than maxEmployees",
        "status": 400
      }
    });
  });
  //TODO: Test for min/max Employees not given as numbers
});

/************************************** GET /companies/:handle */

describe("GET /companies/:handle", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/companies/c1`);
    expect(resp.body).toEqual({
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("works for anon: company w/o jobs", async function () {
    const resp = await request(app).get(`/companies/c2`);
    expect(resp.body).toEqual({
      company: {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/companies/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /companies/:handle */

describe("PATCH /companies/:handle", function () {
  test("unauthorized for non-admins", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          name: "C1-new",
        })
        .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(401);
      expect(resp.body).toEqual({
        error: {message: "Unauthorized", status: 401},
      });
    });
  test("works for admin users", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          name: "C1-new",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      company: {
        handle: "c1",
        name: "C1-new",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          name: "C1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
        .patch(`/companies/nope`)
        .send({
          name: "new nope",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
  //TODO: Test above for non admin with 401?
  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          handle: "c1-new",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  //TODO: Test above for non admin with 401?
  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  //TODO: Test above for non admin with 401?
});

/************************************** DELETE /companies/:handle */

describe("DELETE /companies/:handle", function () {
  test("unauthorized for non-admins", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {message: "Unauthorized", status: 401},
    });
  });

  test("works for admin users", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: "c1" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company for admin", async function () {
    const resp = await request(app)
        .delete(`/companies/nope`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
  //TODO: Test above for non admin with 401?
});
