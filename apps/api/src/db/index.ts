import postgres from "postgres";

const sql = postgres({
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
});

export { sql };
