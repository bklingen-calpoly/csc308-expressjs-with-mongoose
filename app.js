const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");

const userServices = require("./models/user-services");

//  Swagger imports
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// userServices.createDbConnection();

const app = express();
// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

function setDatabaseConn(conn) {
  userServices.setDataBaseConn(conn);
}

// app.connectDB = async () => {
//   await userServices.createDbConnection();
//   // await mongoose.connect(process.env.MONGODB_URI, {
//   //   useNewUrlParser: true,
//   //   useUnifiedTopology: true,
//   // });
//   // userServices.setDataBase(mongoose);
// }

/**
 * @swagger
 * /:
 *   get:
 *     description: get the root
 *     responses:
 *       200:
 *         description: Returns Hello world.
 *
 *
 */
app.get("/", (req, res) => {
  res.json("Hello World!");
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users
 *     description: Get all users, or filter by name, job or both
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: job
 *         required: false
 *         description: Job to filter by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return users - all if no query parameters, filtered by name, job or both if parameters are sent
 */
app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  try {
    const result = await userServices.getUsers(name, job);
    res.json({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

/**
 * @swagger
 * /users{id}:
 *   get:
 *     summary: Get user by id
 *     description: Get the user that matches id
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name to filter by
 *         schema:
 *           type: string
 *       - in: query
 *         name: job
 *         required: false
 *         description: Job to filter by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return users - all if no query parameters, filtered by name, job or both if parameters are sent
 */
app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add users
 *     description: Add users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name.
 *                 example: Harry Potter
 *               job:
 *                 type: string
 *                 description: Their job.
 *                 example: Wizard
 *     responses:
 *       201:
 *         description: User successfully added
 *       400:
 *         description: Error adding user
 */
app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(400).end();
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  if (userServices.deleteUser(id)) res.status(204).end();
  else res.status(404).send("Resource not found.");
});

module.exports = { app, setDatabaseConn };
