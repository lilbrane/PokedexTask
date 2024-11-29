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

app.get("/getPokemon/:name", async(req,res) => {
    const { name } = req.params;

    console.log(name)

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

//   // Iterating through generations
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

        // getting the abilities
        let abilities = await Promise.all(
            data.abilities.map(async(ability) => {
                const {error, abilityInfo} = await getAbility(ability.ability)
                return abilityInfo
            })
        )

        // pokemon types
        let types = data.types.map(type => type.type.name)

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






