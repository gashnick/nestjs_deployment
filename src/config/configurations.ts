export default () => ({
  // console.log("Loaded ENV Variables:");
  // console.log("PORT:", process.env.PORT);
  // console.log("SECRET:", process.env.SECRET);
  // console.log("DB_HOST:", process.env.DB_HOST);
  // console.log("DB_PORT:", process.env.DB_PORT);
  // console.log("USERNAME:", process.env.DB_USER);
  // console.log("PASSWORD:", process.env.PASSWORD);
  // console.log("DB_NAME:", process.env.DB_NAME);
  NODE_ENV: process.env.NODE_EV,
  port: parseInt(process.env.PORT || '3000'),
  secret: process.env.SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dbName: process.env.DB_NAME,
});
