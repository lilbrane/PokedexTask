import React, { useState } from 'react'
import Dropdown from './Dropdown'
import { FaRandom } from "react-icons/fa";

interface PokemonObjt {
    name: string,
    url: string
}

interface TopbarParams {
 availablePokemon: PokemonObjt[],
 selectedPokemon: PokemonObjt,
 setSelectedPokemon: React.Dispatch<React.SetStateAction<PokemonObjt>>; 
}

const Topbar: React.FC<TopbarParams> = ({availablePokemon, selectedPokemon, setSelectedPokemon}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredPokemon, setFilteredPokemon] = useState<PokemonObjt[]>([])

    const pokemonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSelectedPokemon({name: input, url:""});

        if(input.trim() === ""){
            setFilteredPokemon([]);
            setIsDropdownOpen(false);
        }
        else{
            const matches = availablePokemon.filter((pokemon) => 
                pokemon.name.includes(input)
            )

            console.log(matches)

            setFilteredPokemon(matches);
            setIsDropdownOpen(matches.length > 0);
        }
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // const response = await axio
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-[90%] bg-primaryRed mx-auto my-4 rounded-3xl p-4 px-10 flex'>
        <form onSubmit={handleSubmit} className='w-3/4'>
            <input
            value={selectedPokemon.name}
            onChange={pokemonInputChange}
            placeholder='Enter a pokemon name...'
            className='w-full p-2 px-4 rounded-lg text-xl'></input>
        </form>
        <div className='flex w-1/4 items-center'>
            <button className='flex items-center mx-auto border-2 p-2 rounded-md border-primaryBlue hover:scale-105 transition-all duration-200 bg-primaryBlue text-primaryWhite space-x-2'>
                <p>Random</p>
                <FaRandom />
            </button>
        </div>
    </div>
  )
}

export default Topbar