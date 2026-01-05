const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const petitionRoutes = require("./routes/petitionRoutes");
const pollRoutes = require("./routes/pollRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/civix")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
