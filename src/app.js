const express = require("express");
const path = require("path");
const { connectDB } = require("./utils/db");
const trendRoutes = require("./routes/trends");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", trendRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: "An error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
