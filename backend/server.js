import express from "express"
import cors from "cors"
import axios from "axios"
import multer from "multer";
import fs from "fs";

const app = express();

const apiKey = "b822f568ec35a1d5cc873607dfa4c40f";
const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
    }))
    .use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});

// get all pokemon 
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

            // const names = response.data.results.map((result) => result.name);

            pokemon.push(...response.data.results);

            currOffset += limit;

            if(response.data.results.length < limit) break
        }

        
        res.status(200).json({ success: true, data: pokemon }) 
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)

        res.status(500).json({ success: false, message: `Server ERROR while getting all pokemon - ${err.message}` }) 
    }
})

// get pokemon data by name
app.get("/getPokemon/:name", async(req,res) => {
    const { name } = req.params;

    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/"+name);

        const { data } = response;


        // get front_default sprites of all generations
        const defaultSprites = [];
        Object.keys(data.sprites.other).forEach(source => {
            if(data.sprites.other[source].front_default && source !== "official-artwork")
                    defaultSprites.push(data.sprites.other[source].front_default)
        })

        const sprites = [];

        // Iterating through generations
        Object.entries(data.sprites.versions).forEach(([generation, versions]) => {
            const spriteInfo = {
                gen: "",
                version: "",
                sprite: ""
            }

            spriteInfo.gen = generation

            // Iterating through versions
            Object.entries(versions).forEach(([version, sprites]) => {
                spriteInfo.version = version
                spriteInfo.sprite = sprites.front_default
            });

            if(spriteInfo.sprite)
                sprites.push(spriteInfo)
        });

        
        
        // let abilities = data.abilities;
        
        // pokemon types
        let types = data.types.map(type => type.type.name)

        let abilities = []
        for (const ability of data.abilities) {
            try {
                const { error, abilityInfo } = await getAbility(ability.ability);
                
                if (error)
                    return res.status(500).json({ success: false, message: `Server ERROR while getting abilities - ${err.message}` }) 
                
                abilities.push(abilityInfo)

            } catch (err) {
                return res.status(500).json({ success: false, message: `Server ERROR while getting abilities - ${err.message}` }) 
            }
        }

        // weight is in hectograms, conver to kg rounded to two decimals
        const weightInKg = Math.round((data.weight / 10) * 100) / 100;
        const heightInCm = data.height * 10;

        const pokemonNameCaps = data.name.charAt(0).toUpperCase() + data.name.substring(1, data.name.length)
        // const weightInKg = data.weight;

        const pokemon = {
            name: pokemonNameCaps,
            height: heightInCm,
            weight: weightInKg,
            types: types,
            image: data.sprites.other["official-artwork"].front_default,
            abilities: abilities,
            sprites: sprites
        }

        // console.log(pokemon)


        res.status(200).json({ success: true, data: pokemon }) 
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)

        res.status(500).json({ success: false, message: `Server ERROR while getting one pokemon - ${err.message}` }) 
    }
})




const getAbility = async(ability) => {

    try {
        const response = await axios(ability.url);

        const { data } = response;

        const effects = data.effect_entries
                    .filter(effectInfo => effectInfo.language.name === "en")
                    .map(effectInfo => effectInfo.effect)[0]
        
        const abilityInfo = {
            name: ability.name,
            effect: effects
        }


        return { error: null, abilityInfo: abilityInfo}
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)
        return { error: errorMsg, abilityInfo: null }
    }
}


app.post("/image", upload.single("image"), async(req, res) => {
    const imageFile = req.file;
    console.log(imageFile)

    if (!imageFile)
        return res.status(400).json({ error: "No image file provided" });

    try {
        const imageBase64 = fs.readFileSync(imageFile.path, { encoding: "base64" });

        // Prepare the FormData
        const formData = new FormData();
        formData.set("key", apiKey); // Replace with your API key
        formData.append("image", imageBase64);

        const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
    
        });

        // Clean up uploaded file (optional)
        fs.unlinkSync(imageFile.path);

        res.status(200).json({ success: true, data: response.data }) 
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)

        res.status(500).json({ success: false, message: `Server ERROR - ${err.message}` }) 
    }
})

app.get("/types", async(req,res) => {

    try {
        const response = await axios.get("https://pokeapi.co/api/v2/type/", {
            params: {
                limit: 50
            }
        })


        const types = response.data.results.map(item => item.name);

        res.status(200).json({ success: true, data: types }) 
    } catch (err) {
        const errorMsg = err.message;
        console.error(errorMsg)
        res.status(500).json({ success: false, message: `Server ERROR - ${errorMsg}` }) 
    }
})






