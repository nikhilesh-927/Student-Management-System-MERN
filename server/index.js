// At the very top!
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// `multer` and `path` were removed as they are not used.

const app = express();
app.use(cors());
app.use(express.json());
// This line is for serving uploaded files, which is fine to keep for later.
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 8090;

app.get("/", (req, res) => {
  res.json({ message: "Server is running on port " + PORT });
});

const studentSchema = mongoose.Schema(
  {
    image: String,
    name: String,
    address: String,
    grade: Number,
    class: String,
    homeMobile: String,
    motherName: String,
    fatherName: String,
    motherMobile: String,
    fatherMobile: String,
    isMotherEmployed: Boolean,
    motherEmployerName: String,
    motherJobPosition: String,
    isFatherEmployed: Boolean,
    fatherEmployerName: String,
    fatherJobPosition: String,
    hasSiblings: Boolean,
    sibling1Name: String,
    sibling2Name: String,
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("student", studentSchema);

// create data
app.post("/create", async (req, res) => {
  try {
    const data = new studentModel(req.body);
    await data.save();
    res.status(201).json({ success: true, message: "Data saved successfully", data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving data", error: error.message });
  }
});

// Read data
app.get("/getData", async (req, res) => {
  try {
    const data = await studentModel.find({});
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch data.", error: error.message });
  }
});

// update data
app.put("/update", async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    const updatedData = await studentModel.findByIdAndUpdate(_id, rest, { new: true });
    res.send({ success: true, message: "Data updated successfully", data: updatedData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating data", error: error.message });
  }
});

// delete data
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await studentModel.deleteOne({ _id: id });
    res.send({ success: true, message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting data", error: error.message });
  }
});

// Connect to DB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log("Server is running on port " + PORT));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });