const express = require("express");
const app = express();

const doctorRoutes = require("./routes/doctorRoutes");

console.log(doctorRoutes);

app.use("/api/doctors", doctorRoutes);

app.listen(5000, () => {
  console.log("Server running");
});