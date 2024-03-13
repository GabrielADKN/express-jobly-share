const { BadRequestError } = require("../expressError");

/**
 * Generates a SQL update statement for partially updating an entity's properties.
 *
 * This function dynamically constructs a part of an SQL UPDATE statement to update only the specified fields of a database record.
 *
 * Parameters:
 * - dataToUpdate (Object): An object containing the fields to update, with keys as the property names and values as the new values for these properties.
 * - jsToSql (Object): An optional mapping object to translate JavaScript camelCase property names to SQL snake_case column names. If a property name does not exist in the mapping, it will be used as is.
 *
 * Returns:
 * An object with two keys:
 * - setCols (String): A string formatted for the SET clause of an SQL UPDATE statement, containing placeholders (e.g., $1, $2) for parameterized query values.
 * - values (Array): An array of values corresponding to the placeholders in the setCols string. These are the new values to be set in the database.
 *
 * Throws:
 * - BadRequestError: If `dataToUpdate` is empty, indicating there are no fields provided for the update.
 *
 * Example:
 * const dataToUpdate = { firstName: 'Aliya', age: 32 };
 * const jsToSql = { firstName: 'first_name' };
 * sqlForPartialUpdate(dataToUpdate, jsToSql);
 *
 * Returns:
 * {
 *    setCols: '"first_name"=$1, "age"=$2',
 *    values: ['Aliya', 32]
 * }
 *
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // Check if dataToUpdate is empty
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Convert JavaScript property names to SQL column names based on jsToSql mapping and prepare them for parameterized query.
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  // Return an object with setCols and values
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
