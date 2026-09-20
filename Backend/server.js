require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const AuthRouter = require("./routes/auth.routes");

//db connection
const sequelize = require("./config/db");

//use express.json to get data from the JSON object
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.use("/auth", AuthRouter);

app.get("/test", (req, res) => {
  res.send("Server is working properly");
});

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Database connection error:", err));
