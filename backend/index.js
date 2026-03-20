const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const notesRoutes = require("./routes/notes");
app.use("/notes", notesRoutes);

// Test route
app.get("/", (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.json([{ currentTime }]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));