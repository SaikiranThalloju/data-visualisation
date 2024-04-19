const express = require("express");
const app = express();
const port = 5000;
const { MongoClient } = require("mongodb");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.static(path.join(__dirname, "client/build")));

const uri =
  "mongodb+srv://Saikiran_20:Saikiran20@cluster0.vje1fsr.mongodb.net/";
const client = new MongoClient(uri);

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");

    storeDataFromFile();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

async function storeDataFromFile() {
  try {
    const database = client.db("visualisation_task");
    const collection = database.collection("internship");

    const rawData = fs.readFileSync("data.json");
    const jsonData = JSON.parse(rawData);

    const result = await collection.insertMany(jsonData);
    console.log(
      `${result.insertedCount} documents inserted from jsondata.json`
    );
  } catch (error) {
    console.error("Error storing data:", error);
  }
}

app.get("/api/data", async (req, res) => {
  try {
    const database = client.db("visualisation_task");
    const collection = database.collection("internship");
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
