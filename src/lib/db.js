import mysql from "mysql2/promise";

let connection;

export async function getConnection() {
  if (connection && connection.connection && connection.connection.state !== 'disconnected') {
    return connection;
  }
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: '+07:00'
  });
  console.log("✅ Connected to MySQL (AlwaysData)");
  return connection;
}
