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
    const [pokemonIsOfficial, setPokemonIsOfficial] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                  <div className='lg:flex md:col-span-4 col-span-8 relative'>

                    {/* weight and height */}
                    <div className="flex justify-between relative lg:w-1/4 md:items-center items-center">
                      <div className='flex lg:items-center sm:items-center text-3xl'>
                        <p>{pokemonInfo.height} Cm</p>
                      </div>
                      <div className='lg:absolute right-2 top-2'>
                        <TextInLogo textInMiddle={pokemonInfo.weight.toString() + " Kg"} baseSize={100} />
                      </div>
                    </div>

                      {/* image and sprites */}
                      <div className=' lg:mt-12 pt-2 md:flex '>
                        {/* big img */}
                        <div className='xl:w-96 xl:h-96 md:w-80 md:h-80 sm:w-60 sm:h-60 w-40 h-40 sm:mx-auto ml-2  rounded-full border-2 border-primaryBlue p-8 nonSelectable overflow-hidden items-center flex'>
                          <img src={pokemonInfo.image} alt="Pokemon Artwork " className='object-scale-down'/>
                        </div>

                        {/* other sprites */}
                        {(pokemonIsOfficial && pokemonInfo.sprites.length > 0) &&
                          <div className='absolute xl:bottom-2 lg:bottom-14 md:bottom-0 bottom-0 md:right-0 right-12 flex items-end '>
                            <IoCaretBackOutline onClick={prevImage} size={30} className='arrowIcons'/>
                            <div className=''>
                              <div className='xl:w-32 xl:h-32 lg:w-28 lg:h-28 sm:w-20 sm:h-20 w-10 h-10 mx-auto rounded-full border-2 border-primaryBlue p-2 flex justify-center items-center bg-primaryWhite '>
                                <img 
                                  src={pokemonInfo.sprites[shownImageIdx].sprite && pokemonInfo.sprites[shownImageIdx].sprite} 
                                  alt="Pokemon sprite" 
                                  className='object-scale-down min-w-full min-h-full rounded-full nonSelectable' 
                                  />
                              </div>
                              <p className='nonSelectable sm:text-base text-sm'>{pokemonInfo.sprites[shownImageIdx].gen}</p>
                            </div>
                            <IoCaretForwardOutline onClick={nextImage} size={30} className='arrowIcons'/>
                          </div>
                        }
                    </div>
                  </div>

                  {/* other info*/}
                  <div className='md:col-span-4 col-span-8 p-4 space-y-4  '>
                    {/* name and types */}
                    <div className='text-left md:space-y-4 nonSelectable flex md:block items-center space-x-4 '>
                      <p className='md:text-3xl text-xl font-semibold '>
                        {pokemonInfo.name}
                      </p>
                      <div className='md:w-2/3 flex space-x-4 '>
                        {pokemonInfo.types.map((type, index) => (
                          <div key={index} className='w-fit p-2 rounded-md border-2 border-primaryRed'>
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
        
                              <div className="max-h-[350px]  overflow-hidden">
                                <table className="w-full table-auto">
                                  <thead>
                                    <tr>
                                      <th className="px-4 py-2">Name</th>
                                      <th className="px-4 py-2">Effect</th>
                                    </tr>
                                  </thead>
                                </table>
                              
                              <div className="overflow-y-auto h-[calc(350px-36px)]">
                                <table className="w-full table-auto">
                                  <tbody>
                                    {pokemonInfo.abilities.map((ability, index) => (
                                      <tr key={index} className="hover:bg-primaryBlue hover:bg-opacity-35 border-b-2 border-primaryBlue" 
                                      onMouseEnter={() => setHoveredIndex(index)}  // Mouse enters
                                      onMouseLeave={() => setHoveredIndex(null)}  // Mouse leaves
                                    >
                                        <td className="px-4 py-2">{ability.name}</td>
                                        <td className="px-4 py-2">
                                          {hoveredIndex === index
                                              ? ability.effect // Show full effect if this row is hovered
                                              : ability.effect?.substring(0, 100) + '...'} 
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