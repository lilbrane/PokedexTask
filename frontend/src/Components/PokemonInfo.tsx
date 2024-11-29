import React, { useEffect, useState } from 'react'
import { EmptyPokemonLng, PokemonObjt, PokemonObjtLong } from '../pokemonShortObj'
import axios from 'axios';

interface PokemonInfoParams{
    selectedPokemon: PokemonObjt
}

const PokemonInfo: React.FC<PokemonInfoParams> = ({selectedPokemon}) => {
    const [pokemonInfo, setPokemonInfo] = useState<PokemonObjtLong>(EmptyPokemonLng);
    const [showPokemonData, setShowPokemonData] = useState(pokemonInfo.name !== "");


    useEffect(() => {
        if (selectedPokemon.url !== "") {
          setPokemonInfo(EmptyPokemonLng)
            const fetchData = async () => {
              try {
                const response = await axios("http://localhost:3001/getPokemon/"+selectedPokemon.name);
                console.log(response.data.data);

                if (response.data && response.data.data) {
                    setPokemonInfo(response.data.data); 
                    setShowPokemonData(true)
                  }

              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
      
            fetchData();
          }
        else{
            setShowPokemonData(false)
        }
        }, [selectedPokemon.url]);  
    
  return (
    <div>
        {!showPokemonData ?
            <p>
                {selectedPokemon.name === "" && "No pokemon selected :("}
                {(selectedPokemon.name !== "" && selectedPokemon.url === "") && 
                `Pokemon ${selectedPokemon.name} doesn't exist`}
                asd
            </p>
        :
        (
            <div>
              {pokemonInfo != EmptyPokemonLng ? (
                <p>Weight: {pokemonInfo.weight}</p> // Only render when data is filled
              ) : (
                <p>Loading...</p> // Show loading state when info is retrieving
              )}
            </div>
          )
        }
    </div>
  )
}

export default PokemonInfo