import React, { useEffect, useState } from 'react'
import { EmptyPokemonLng, PokemonObjt, PokemonObjtLong } from '../pokemonShortObj'
import axios from 'axios';
import TextInLogo from './TextInLogo';

interface PokemonInfoParams{
    selectedPokemon: PokemonObjt
}

const PokemonInfo: React.FC<PokemonInfoParams> = ({selectedPokemon}) => {
    const [pokemonInfo, setPokemonInfo] = useState<PokemonObjtLong>(EmptyPokemonLng);
    const [showPokemonData, setShowPokemonData] = useState(pokemonInfo.name !== "");
    const [shownImageIdx, setShownImageIdx] = useState(0);


    useEffect(() => {
        if (selectedPokemon.url !== "") {
          setPokemonInfo(EmptyPokemonLng)
            const fetchData = async () => {
              try {
                const response = await axios("http://localhost:3001/getPokemon/"+selectedPokemon.name);
                console.log(response.data.data);
                const { data } = response.data;

                console.log(data.sprites)
                if (data) {
                    setPokemonInfo(data); 
                    setShowPokemonData(true);
                    setShownImageIdx(0);
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

    const nextImage = () => {
      console.log(pokemonInfo.sprites.length, shownImageIdx)
      if(shownImageIdx === pokemonInfo.sprites.length - 1)
        setShownImageIdx(0);
      else
        setShownImageIdx(shownImageIdx + 1)
    }

    const prevImage = () => {
      if(shownImageIdx === 0)
        setShownImageIdx(pokemonInfo.sprites.length - 1);
      else
        setShownImageIdx(shownImageIdx - 1)
    }
    
  return (
    <div>
        {!showPokemonData ?
            <p>
                {selectedPokemon.name === "" && "No pokemon selected :("}
                {(selectedPokemon.name !== "" && selectedPokemon.url === "") && 
                `Pokemon ${selectedPokemon.name} doesn't exist`}
            </p>
        :
        (
            <div>
              {pokemonInfo != EmptyPokemonLng ? (
                <div className='p-8 grid grid-cols-6'>
                  {/* weight and height */}
                  <div className="col-span-1 flex justify-between">
                    <div className='flex items-center text-3xl'>
                      <p>{pokemonInfo.height} Cm</p>
                    </div>
                    <div>
                      <TextInLogo textInMiddle={pokemonInfo.weight.toString() + " Kg"} baseSize={100} />
                    </div>
                  </div>
                  {/* image and sprites */}

                    <div className=' w-80 h-80 rounded-full border-2 border-primaryBlue p-8 col-span-2 relative'>
                      <img src={pokemonInfo.sprites[shownImageIdx].sprite} alt="Pokemon Sprite"/>
                      <div className='absolute bottom-2 right-2'>
                        <p onClick={nextImage}>next</p>
                        <p onClick={prevImage}>prev</p>
                      </div>

                    </div>

                  {/* other info*/}
                  <div className='col-span-3 bg-blue-200 p-4 space-y-4'>
                    {/* name and types */}
                    <div className='text-left space-y-4'>
                      <p className='text-3xl font-semibold'>
                        {pokemonInfo.name}
                      </p>
                      <div className='w-2/3 flex space-x-4'>
                        {pokemonInfo.types.map((type, index) => (
                          <div 
                          key={index}
                          className='w-fit p-2 rounded-md border-2 border-primaryRed'>
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* abilities */}

                      <div className='border-primaryRed border-2 rounded-xl p-4 text-left'>
                        <p className='text-xl'>{pokemonInfo.name} abilities:</p>
                      { pokemonInfo.abilities &&

                          <table className='space-x-2'>
                            <tr>
                              <th className='px-4 py-2'>Name</th>
                              <th className='px-4 py-2'>Effect</th>
                            </tr>
                            <tbody>
                              {pokemonInfo.abilities.map((ability, index) => (
                                <tr key={index}>
                                  <td className='px-4 py-2'>{ability.name}</td>
                                  <td className='px-4 py-2'>{ability?.effect.substring(0, 100)}...</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
}
                      </div>

                  </div>

                </div>
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