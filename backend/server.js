const express = require("express");
const cors = require("cors");
// import 'dotenv/config.js'

const PORT =  5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Api working");
})

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})