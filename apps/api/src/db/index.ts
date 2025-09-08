import { Knex } from "knex";
import * as knexPkg from "knex";
import pg from "pg";

const { knex } = knexPkg.default;

const dbConnectionConfig: Knex.PgConnectionConfig = {
  host: process.env.DB_HOSTNAME || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "",
  user: process.env.DB_USERNAME || "",
  password: process.env.DB_PASSWORD || "",
  ssl: ["development", "test"].includes(process.env.NODE_ENV ?? "")
    ? false
    : {
        rejectUnauthorized: false,
      },
};

const DATE_OID = 1082;
const parseDate = (value: unknown): unknown => value;

const NUMERIC_OID = 1700;
const parseNumeric = (value: string): unknown => parseFloat(value);

// TODO: For COUNTs
//       https://stackoverflow.com/questions/66389300/postgres-cast-count-as-integer
//       types.setTypeParser(20, function(val) {
//         return parseInt(val, 10)
//       })

function getDbConnectionPool(): Knex {
  /* Knex automatically returns a js date object, which is not what we want. Here's a trick to return the date only https://github.com/knex/knex/issues/3071 */
  pg.types.setTypeParser(DATE_OID, parseDate);
  pg.types.setTypeParser(NUMERIC_OID, parseNumeric);

  return knex({
    client: "postgresql",
    connection: dbConnectionConfig,
    acquireConnectionTimeout: 30000,
    pool: {
      min: 0,
      max: 60,
    },
  });
}

const dbConnection = getDbConnectionPool();

export { dbConnectionConfig, dbConnection };
