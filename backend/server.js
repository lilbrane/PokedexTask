import express from "express"
import cors from "cors"
import axios from "axios"

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
    }))
    .use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    console.log("here")

    res.status(200).json({ success: true, data: "here" }) 
});






