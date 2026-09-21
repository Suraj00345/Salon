require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/Index");

const AuthRouter = require("./routes/auth.routes");
const UserRouter = require("./routes/user.routes");
const ServiceRouter = require("./routes/service.routes");

//use express.json to get data from the JSON object
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 3001;

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/service", ServiceRouter);

//test api
app.get("/test", (req, res) => {
  res.send("Server is working properly");
});

//server running
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Database connection error:", err));
