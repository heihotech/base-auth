const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const db = require("./app/models");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const Role = db.role;

// prod mode
// db.sequelize.sync();

// dev mode
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});

function initial() {
  Role.bulkCreate([
    { name: "super" },
    { name: "admin" },
    { name: "user" },
    { name: "nurse" },
    { name: "head of department" },
    { name: "head of section" },
    { name: "head of division" },
    { name: "finance" },
  ]);
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Auth app..." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
