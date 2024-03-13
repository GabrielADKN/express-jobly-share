const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
    test("successfully generates SQL for partial update", () => {
        const dataToUpdate = { firstName: "John", lastName: "Doe" };
        const jsToSql = { firstName: "first_name", lastName: "last_name" };
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toEqual({
            setCols: '"first_name"=$1, "last_name"=$2',
            values: ["John", "Doe"],
        });
    });

    test("handles conversion of JavaScript naming to SQL naming", () => {
        const dataToUpdate = { firstName: "Jane", age: 30 };
        const jsToSql = { firstName: "first_name" };
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result.setCols).toBe('"first_name"=$1, "age"=$2');
        expect(result.values).toEqual(["Jane", 30]);
    });

    test("throws BadRequestError if dataToUpdate is empty", () => {
        expect(() => {
            sqlForPartialUpdate({}, {});
        }).toThrow(BadRequestError);
    });

    test("works without jsToSql mapping", () => {
        const dataToUpdate = { name: "Test", value: 100 };
        const result = sqlForPartialUpdate(dataToUpdate, {});

        expect(result.setCols).toBe('"name"=$1, "value"=$2');
        expect(result.values).toEqual(["Test", 100]);
    });
});
