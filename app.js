const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { createUser, signIn } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

app.post("/signin", signIn);
app.post("/signup", createUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
