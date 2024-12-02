import React, { useEffect, useState } from 'react'
import { EmptyPokemonLng, PokemonObjt, PokemonObjtLong } from '../pokemonShortObj'
import axios from 'axios';
import TextInLogo from './TextInLogo';
import { IoCaretForwardOutline, IoCaretBackOutline  } from "react-icons/io5";

interface PokemonInfoParams{
    selectedPokemon: PokemonObjt
}

const PokemonInfo: React.FC<PokemonInfoParams> = ({selectedPokemon}) => {
    const [pokemonInfo, setPokemonInfo] = useState<PokemonObjtLong>(EmptyPokemonLng);
    const [showPokemonData, setShowPokemonData] = useState(pokemonInfo.name !== "");
    const [shownImageIdx, setShownImageIdx] = useState(0);
    const [pokemonIsOfficial, setPokemonIsOfficial] = useState(false)

    useEffect(() => {
      console.log(selectedPokemon)
        if (selectedPokemon.url !== "" && selectedPokemon.official) {
          setPokemonInfo(EmptyPokemonLng)
            const fetchData = async () => {
              try {
                const response = await axios("http://localhost:3001/getPokemon/"+selectedPokemon.name);
                const { data } = response.data;

                if (data) {
                  console.log("data", data)

                    setPokemonInfo(data); 
                    setShowPokemonData(true);
                    setShownImageIdx(0);
                  }

                setPokemonIsOfficial(true)

              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
      
            fetchData();
          }

        // if selected pokemon is one of the created ones
        else if(!selectedPokemon.official){

          const localStoragePoke = localStorage.getItem("pokemons");
          if(localStoragePoke){
            const savedPokemon = JSON.parse(localStoragePoke);

            savedPokemon.forEach((pokemon: any) => {
              console.log(pokemon)
              if(pokemon.name == selectedPokemon.name){
                let poke = { ...EmptyPokemonLng }; 
                poke.name = selectedPokemon.name;
                poke.description = pokemon.description;
                poke.image = pokemon.imageUrl;
                poke.weight = pokemon.weight;
                poke.height = pokemon.height;
                setPokemonInfo(poke); 
                setShowPokemonData(true);
      
                setPokemonIsOfficial(false)
              }
                
            });
          }
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
            <div className=''>
              {pokemonInfo != EmptyPokemonLng ? (
                <div className='p-8 grid grid-cols-8 '>
                  {/* weight and height */}
                  <div className="col-span-1 flex justify-between relative">
                    <div className='flex items-center text-3xl'>
                      <p>{pokemonInfo.height} Cm</p>
                    </div>
                    <div className='absolute right-2 top-2'>
                      <TextInLogo textInMiddle={pokemonInfo.weight.toString() + " Kg"} baseSize={100} />
                    </div>
                  </div>
                  {/* image and sprites */}
                    <div className='col-span-3 relative'>
                        {/* big img */}
                      <div className='w-96 h-96 rounded-full border-2 border-primaryBlue p-8 nonSelectable overflow-hidden items-center flex'>
                        <img src={pokemonInfo.image} alt="Pokemon Artwork " className='object-scale-down'/>
                      </div>

                      {/* other sprites */}
                      {(pokemonIsOfficial && pokemonInfo.sprites.length > 0) &&
                        <div className='absolute bottom-2 right-2 flex items-end'>
                          <IoCaretBackOutline onClick={prevImage} size={30} className='hover:scale-125 duration-200 transition-all'/>
                          <div>
                            <div className='w-32 h-32 rounded-full border-2 border-primaryBlue p-2 flex justify-center items-center bg-primaryWhite '>
                              <img 
                                src={pokemonInfo.sprites[shownImageIdx].sprite && pokemonInfo.sprites[shownImageIdx].sprite} 
                                alt="Pokemon sprite" 
                                className='object-scale-down min-w-full min-h-full rounded-full nonSelectable' 
                                />
                            </div>
                            <p className='nonSelectable'>{pokemonInfo.sprites[shownImageIdx].gen}</p>
                          </div>
                          <IoCaretForwardOutline onClick={nextImage} size={30} className='hover:scale-125 duration-200 transition-all'/>
                        </div>
                      }
                    </div>
                    

                  {/* other info*/}
                  <div className='col-span-4 p-4 space-y-4  '>
                    {/* name and types */}
                    <div className='text-left space-y-4 nonSelectable'>
                      <p className='text-3xl font-semibold '>
                        {pokemonInfo.name}
                      </p>
                      <div className='w-2/3 flex space-x-4 '>
                        {pokemonInfo.types.map((type, index) => (
                          <div 
                          key={index}
                          className='w-fit p-2 rounded-md border-2 border-primaryRed'>
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* abilities/description */}
                      <div className='border-primaryRed border-2 rounded-xl p-4 text-left '>
                        { !pokemonIsOfficial ?
                            // pokemon description if pokemon isnt official
                          (
                            <div>
                              <p className='text-xl'>{pokemonInfo.name} description:</p>
                              <div>
                                {pokemonInfo.description}
                              </div>
                            </div>
                          )
                          : 
                          (
                            // pokemon abilities if pokemon is official
                            <div>
                              <p className='text-xl'>{pokemonInfo.name} abilities:</p>
                              { pokemonInfo.abilities &&
        
                              <div className="h-[250px] overflow-hidden">
                              <table className="w-full table-auto">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Effect</th>
                                  </tr>
                                </thead>
                              </table>
                              
                              <div className="overflow-y-auto h-[calc(250px-36px)]">
                                <table className="w-full table-auto">
                                  <tbody>
                                    {pokemonInfo.abilities.map((ability, index) => (
                                      <tr key={index} className="hover:bg-primaryBlue hover:bg-opacity-35 border-b-2 border-primaryBlue">
                                        <td className="px-4 py-2">{ability.name}</td>
                                        <td className="px-4 py-2">
                                          {ability.effect && ability.effect.substring(0, 100)}...
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              </div>
        
                              }
                            </div>
                          )
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