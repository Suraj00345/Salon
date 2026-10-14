const { Sequelize } = require("sequelize");
require("dotenv").config(); // Ensure environment variables are loaded

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        // rejectUnauthorized: false bypasses strict self-signed certificate checks.
        // For production, you can download Aiven's CA certificate and provide it via 'ca: fs.readFileSync(...)'.
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Database connection established successfully with Aiven MySQL.",
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();
module.exports = sequelize;
