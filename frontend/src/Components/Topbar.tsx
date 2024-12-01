import React, { useState } from 'react'
import Dropdown from './Dropdown'
import { FaRandom } from "react-icons/fa";
import {PokemonObjt, EmptyPokemon} from "../pokemonShortObj"


interface TopbarParams {
 availablePokemon: PokemonObjt[],
 selectedPokemon: PokemonObjt,
 setSelectedPokemon: React.Dispatch<React.SetStateAction<PokemonObjt>>; 
}

const Topbar: React.FC<TopbarParams> = ({availablePokemon, selectedPokemon, setSelectedPokemon}) => {
    const [typedPokemon, setTypedPokemon] = useState(selectedPokemon);
    const [similarPokemonName, setSimilarPokemonName] = useState<PokemonObjt>(EmptyPokemon)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredPokemon, setFilteredPokemon] = useState<PokemonObjt[]>([])

    const pokemonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.toLowerCase();
        setTypedPokemon({name: input, url:""});

        if(input.trim() === ""){
            setFilteredPokemon([]);
            setIsDropdownOpen(false);
        }
        else{
            const matches = availablePokemon.filter((pokemon) => 
                pokemon.name.toLowerCase().includes(input)
            )

            console.log(matches)

            if(matches.length === 1)
                setSimilarPokemonName(matches[0])
            else if(matches.length > 1){
                if(matches[0].name === input)
                    setSimilarPokemonName(matches[0])
                else
                    setSimilarPokemonName({name: input, url: ""})

            }
            else
                setSimilarPokemonName({name: input, url: ""})

            setFilteredPokemon(matches);
            setIsDropdownOpen(matches.length > 0);
        }
    };

    const pokemonSelect = (pokemon: PokemonObjt) => {
        setSelectedPokemon(pokemon);
        setTypedPokemon(pokemon);
        setSimilarPokemonName(pokemon)
        setIsDropdownOpen(false);
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(similarPokemonName)
        if(similarPokemonName.url != ""){
            setTypedPokemon(similarPokemonName)
        }

        setSelectedPokemon(similarPokemonName)
    }

    const choseRandomPokemon = () => {
        const arrLength = availablePokemon.length

        const randomIdx = Math.floor(Math.random() * (arrLength - 0 + 1) + 0);
        const randomPokemon = availablePokemon[randomIdx];
        setIsDropdownOpen(false);

        setTypedPokemon(randomPokemon)
        setSimilarPokemonName(randomPokemon)
        setSelectedPokemon(randomPokemon)

    }

  return (
    <div className='w-[90%] bg-primaryRed mx-auto my-4 rounded-3xl p-4 px-10 flex'>
        <div className='w-3/4'>
            <form onSubmit={handleSubmit}>
                
                <input
                    value={typedPokemon.name}
                    onChange={pokemonInputChange}
                    placeholder='Enter a pokemon name...'
                    className='w-full p-2 px-4 rounded-lg text-xl' 
                />

                {isDropdownOpen && (
                    <ul className='absolute bg-white rounded-b-lg rounded--lg max-h-40 overflow-y-auto w-80 ml-2 scrollbar-hide z-10'>
                        {filteredPokemon.map((pokemon, index) => (
                            <li key={index} 
                                onClick={() => pokemonSelect(pokemon)}
                                className='hover:bg-primaryBlue hover:text-primaryWhite'>
                                {pokemon.name}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
            

        </div>
        <div className='flex w-1/4 items-center'>
            <button 
            onClick={choseRandomPokemon}
            className='flex items-center mx-auto border-2 p-2 rounded-md border-primaryBlue hover:scale-105 transition-all duration-200 bg-primaryBlue text-primaryWhite space-x-2'>
                <p>Random</p>
                <FaRandom />
            </button>
        </div>
    </div>
  )
}

export default Topbar