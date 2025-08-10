const express = require("express");
const mongoose = require("mongoose");
//const mainRouter = require('./routes/index');
const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);



  app.use(express.json());

  console.log("app running")
  app.use((req, res) => {
    console.log("GET request received at /");
    res.status(201).send({ message: "User created successfully" });
  });

//app.use('/', mainRouter);

// const routes= require('./routes/index');
// app.use(routes);


const stack = (app._router && app._router.stack) || [];

console.log(app._router);

stack.filter(r => r.route).forEach(r => {
  console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
