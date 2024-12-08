import React, { useEffect, useState } from 'react'
import { PokemonObjt, PokemonObjtLong } from '../pokemonShortObj';
import axios from 'axios';


interface FavouritePokemonParams{
    choosePokemon: (choosenPokemon: PokemonObjt) => void;  // Function type
}

const FavouritePokemon: React.FC<FavouritePokemonParams> = ({ choosePokemon }) => {
    const [favPokemon, setFavPokemon] = useState<[PokemonObjtLong, string][]>([]);

    useEffect(() => {
      const fetchData = async () => {
            const favPokeData = localStorage.getItem("favouritePokemon");

            if(favPokeData){
                const favPokeArr: PokemonObjt[] = JSON.parse(favPokeData);
                
                try {
                    // Fetch all data for pokemon
                    const responses = await Promise.all(
                      favPokeArr.map((pokemon: PokemonObjt) => 
                        axios.get(`http://localhost:3001/getPokemon/${pokemon.name}`)
                      )
                    );
          
                    // get long data from backend
                    const fetchedData: [PokemonObjtLong, string][] = responses.map(
                        (response, index) => [
                          response.data.data, 
                          favPokeArr[index].url, 
                        ]
                      );
                    setFavPokemon(fetchedData);
                  } catch (error) {
                    console.error("Error fetching data:", error);
                  }
            }
        }

        fetchData();
    }, []);
    
  return (
    <div className='w-[80%] mx-auto'>
        <p className='text-2xl font-semibold mb-4'>Your favourite pokemon: </p>
        {favPokemon.length === 0 
        ?
            <p className='text-2xl'>You haven't favourited any pokemon</p>
        :
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 p-6">
                {favPokemon.map((pokemon: [PokemonObjtLong, string], index) => (
                    <div key={index} 
                        className="bg-gray-100 rounded-lg shadow-md p-4 text-center transform transition-transform hover:scale-105 border-2 border-primaryBlue"
                        onClick={() => choosePokemon({
                            name: pokemon[0].name.toLowerCase(),
                            url: pokemon[1],
                            official: true
                        })}
                        >
                        <img src={pokemon[0].image} alt={pokemon[0].name} className="w-full h-auto rounded-lg" />
                        <p className="mt-4 text-xl font-semibold text-gray-800">{pokemon[0].name}</p>
                        <div className='flex justify-between w-2/3 mx-auto mb-2'>
                            <p className="mt-2 text-sm text-gray-500">{pokemon[0].height} m</p>
                            <p className="mt-2 text-sm text-gray-500">{pokemon[0].weight} kg</p>
                        </div>
                        <div className='flex space-x-2 justify-center'>
                        {pokemon[0].types.map((type) => (
                                <p className='bg-primaryRed bg-opacity-80 rounded-md py-1 px-2'>{type}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        }
        
    </div>
  )
}

export default FavouritePokemon