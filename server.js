const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ important for POST
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// ✅ Connect ONCE (best practice)
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        
    } catch (err) {
        console.log(err);
    }
}
connectDB();

// ✅ GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db("apnacollege-db");
        const data = await db.collection("users").find({}).toArray();
        res.send(data);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// ✅ POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;

        const db = client.db("apnacollege-db");
        const result = await db.collection("users").insertOne(userObj);

        console.log("✅ Data inserted");

        res.send({
            message: "User added successfully",
            data: result
        });

    } catch (err) {
        res.status(500).send("Error inserting user");
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});