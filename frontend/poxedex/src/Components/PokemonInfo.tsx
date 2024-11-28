import React, { useState } from 'react'
import { PokemonObjt } from '../pokemonShortObj'

interface PokemonInfoParams{
    selectedPokemon: PokemonObjt
}

const PokemonInfo: React.FC<PokemonInfoParams> = ({selectedPokemon}) => {
    
  return (
    <div>
        {selectedPokemon.url === "" ?
            <p>
                {selectedPokemon.name === "" && "No pokemon selected :("}
                {(selectedPokemon.name !== "" && selectedPokemon.url === "") && 
                `Pokemon ${selectedPokemon.name} doesn't exist`}
            </p>
        :
            <p>
                {selectedPokemon.name}
            </p>
        }
    </div>
  )
}

export default PokemonInfo