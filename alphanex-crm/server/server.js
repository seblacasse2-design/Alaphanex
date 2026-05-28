import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Alphanex API running" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
