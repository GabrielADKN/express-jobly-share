"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        title: "New",
        salary: 100,
        equity: "0.01",
        companyHandle: "c1",
    };

    test("ok for admin", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
    });

    test("denied for non-admin", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});

/************************************** GET /jobs */
describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs").send();
        expect(resp.statusCode).toEqual(200);
    });
});

/************************************** GET /jobs with filter */
describe("GET /jobs with filter", function () {
    test("minimum salary", async function () {
        const resp = await request(app).get("/jobs?minSalary=100").send();
        expect(resp.statusCode).toEqual(200);
    });
})