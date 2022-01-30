module.exports = {
  type: "mysql",
  host: process.env.DB_HOST_NAME,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/entity/**/*.js"],
  synchronize: true,
};
