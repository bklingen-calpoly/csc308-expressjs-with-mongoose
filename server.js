const database = require("./database");
const appModule = require("./app.js");
const port = process.env.PORT || 8000;

// appModule.app.connectDB();

database
  .connect()
  .then((conn) => appModule.setDatabaseConn(conn))
  .catch((error) => console.log(error));

appModule.app.listen(port, () => {
  console.log(`REST API is listening on port: ${port}`);
});
