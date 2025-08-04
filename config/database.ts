import { Sequelize } from "sequelize";
import dotenv from "dotenv"; 

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // database name
  process.env.DATABASE_USERNAME, // username
  process.env.PASSWORD, // password
  {
    host: process.env.DATABASE_HOST, // link hosting
    dialect: "mysql",
    port: 3307
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connect Success");
  })
  .catch((error) => {
    console.log("Connect Error: ", error);
  });

export default sequelize;