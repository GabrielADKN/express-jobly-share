"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
        title: "New",
        salary: 100,
        equity: "0.01",
        companyHandle: "c1",
    };

    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            id: expect.any(Number),
            ...newJob,
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
             FROM jobs
             WHERE title = 'New'`
        );
        expect(result.rows).toEqual([
            {
                id: job.id,
                ...newJob,
            },
        ]);
    });

    test("bad request with dupe", async function () {
        try {
            await Job.create(newJob);
            await Job.create(newJob);
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
            expect(err.message).toEqual("Duplicate job: New");
        }
    });

    test("bad request with invalid data", async function () {
        try {
            await Job.create({
                salary: 100,
                equity: "0.01",
                companyHandle: "c1",
            });
            fail();
        } catch (err) {
            console.log(err);
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("bad request with invalid field value", async function () {
        try {
            await Job.create({
                title: "New",
                salary: -100,
                equity: "0.01",
                companyHandle: "c1",
            });
            fail("Should not reach this point");
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "j1",
                salary: 10000,
                equity: "0.1",
                companyHandle: "c1",
            },
            {
                id: expect.any(Number),
                title: "j2",
                salary: 20000,
                equity: "0.2",
                companyHandle: "c2",
            },
            {
                id: expect.any(Number),
                title: "j3",
                salary: 3,
                equity: "0.3",
                companyHandle: "c3",
            },
        ]);
    });
});

/************************************** get */

describe("get", function () {
    test("not found if no such job", async function () {
        try {
            await Job.get(999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});