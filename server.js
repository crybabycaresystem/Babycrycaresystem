const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log("=====================================");
    console.log("Baby Cry AI Monitoring System");
    console.log("Running at http://localhost:3000");
    console.log("=====================================");
});
