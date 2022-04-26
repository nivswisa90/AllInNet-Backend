const express = require("express");
const cors = require("cors");
// Load the .env file
require("dotenv").config();
// Load express const
const port = process.env.PORT || 5000;
const app = express();

// Import mongoose database connection
const Database = require("./DB/DBconnection");

// Parsing body and url
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cors
app.use(cors());

// Initialize routes

const {apiRouter} = require("./routers/apiRouter");
const {logger} = require("./API/Utils/logger");
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.send("Welcome to All In Net server");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    logger.log({
        level: "Error",
        message: `Something is broken!: ${err}`,
    });
    res.status(500).send("Something is broken!");
});

// Connect to DB and listening to the server
app.listen(port, async () => {
    let uri = process.env.MONGO_URI;
    const DateBase = new Database(uri);
    await DateBase.connectToDB();
    console.log(`[+] Listening on PORT: ${port}`);
});
