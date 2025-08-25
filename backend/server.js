const express = require("express");
const cors = require("cors");
'dotenv/config.js'

const PORT = process.env.PORT ||  5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Api working");
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})