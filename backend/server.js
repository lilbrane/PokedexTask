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

app.get("/getPokemon", async(req,res) => {
    const pokemon = [];

    let currOffset = 0;
    const limit = 300;

    try {

        while(true){

            const response = await axios.get("https://pokeapi.co/api/v2/pokemon", {
                params: {
                    limit: limit,
                    offset: currOffset
                }
            })

            pokemon.push(...response.data.results);
            console.log(response.data.results.length)

            currOffset += limit;

            if(response.data.results.length < limit) break
            
        }
        console.log(pokemon.length)

        
        res.status(200).json({ success: true, data: pokemon }) 
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)

        res.status(500).json({ success: false, message: `Server ERROR - ${err.message}` }) 
    }
})






