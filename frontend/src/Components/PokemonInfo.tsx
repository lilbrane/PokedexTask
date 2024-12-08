import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { EmptyPokemonLng, PokemonObjt, PokemonObjtLong } from '../pokemonShortObj'
import { IoCaretForwardOutline, IoCaretBackOutline  } from "react-icons/io5";
import TextInLogo from './TextInLogo';
import Loader from './Loader';
import { FaRegStar, FaStar } from "react-icons/fa";
import { useStartMove } from '../anim';
import { animated } from 'react-spring';

interface PokemonInfoParams{
    selectedPokemon: PokemonObjt
}


const PokemonInfo: React.FC<PokemonInfoParams> = ({selectedPokemon}) => {
    const [pokemonInfo, setPokemonInfo] = useState<PokemonObjtLong>(EmptyPokemonLng);
    const [showPokemonData, setShowPokemonData] = useState(pokemonInfo.name !== "");
    const [shownImageIdx, setShownImageIdx] = useState(0);
    const [pokemonIsOfficial, setPokemonIsOfficial] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isUsersFavPokemon, setIsUsersFavPokemon] = useState(false);

    const [starAnimate, setStarAnimate] = useState(false);
    const starAnimated = useStartMove(starAnimate, setStarAnimate);

    // check if current pokemon is users favorite
    const checkIfFav = () => {
      const favPokemonData = localStorage.getItem("favouritePokemon");

      if(favPokemonData){
        const favPokemonArray = JSON.parse(favPokemonData);

        return favPokemonArray.some((pokemon: PokemonObjt) => pokemon.name === selectedPokemon.name)
      }
      else 
        return  false
    }

    // on load / on selectedPokemon name change, call backend to GET pokemon info if pokemon is official,
    // if pokemon is not official = we created it, get its data from localhost
    useEffect(() => {
      setShowPokemonData(true)
        if (selectedPokemon.url !== "" && selectedPokemon.official) {
          setPokemonInfo(EmptyPokemonLng)
          console.log(selectedPokemon)
            const fetchData = async () => {
              try {
                const response = await axios("http://localhost:3001/getPokemon/"+selectedPokemon.name);
                const { data } = response.data;

                if (data) {
                    setPokemonInfo(data); 
                    setShownImageIdx(0);
                  }

                setPokemonIsOfficial(true)

              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
      
            fetchData();
            setIsUsersFavPokemon(checkIfFav());
          }

        // if selected pokemon is one of the created ones
        else if(!selectedPokemon.official){
          const localStoragePoke = localStorage.getItem("pokemons");
          if(localStoragePoke){
            const savedPokemon = JSON.parse(localStoragePoke);

            savedPokemon.forEach((pokemon: any) => {
              if(pokemon.name === selectedPokemon.name){
                let poke = { ...EmptyPokemonLng }; 
                poke.name = selectedPokemon.name;
                poke.description = pokemon.description;
                poke.image = pokemon.imageUrl;
                poke.weight = pokemon.weight;
                poke.height = pokemon.height;
                poke.types = pokemon.types;

                setPokemonInfo(poke); 
                setPokemonIsOfficial(false)
              }
            });
          }
        }
        else{
            setShowPokemonData(false)
        }
        }, [selectedPokemon.name]);  

    const nextImage = () => {
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

    const abilityEffectName = (effect: string | null, index: number) => {
      if(!effect) return "No effect description"

      else if(hoveredIndex === index)
        return effect
      else 
        return effect?.substring(0, 100) + '...'
    }


   

    const addOrRemoveFavourite = () => {
      const favPokemonData = localStorage.getItem("favouritePokemon");

      if(favPokemonData){
        const favPokemonArray = JSON.parse(favPokemonData);

        // add
        if(!isUsersFavPokemon){
          favPokemonArray.push(selectedPokemon);
          localStorage.setItem("favouritePokemon", JSON.stringify(favPokemonArray));
          setIsUsersFavPokemon(true);
        }
        // remove
        else{
          const updatedArray = favPokemonArray.filter((pokemon: PokemonObjt) => pokemon.name !== selectedPokemon.name);
          localStorage.setItem("favouritePokemon", JSON.stringify(updatedArray));
          setIsUsersFavPokemon(false);
        }
        
      }
      else{
        const selectedPokeString = JSON.stringify([selectedPokemon]);
        localStorage.setItem("favouritePokemon", selectedPokeString);
      }

      
    }
    
  return (
    <div>
      {/* noPokemon selected or undefiend pokemon */}
        {!showPokemonData ?
            <div className='text-xl flex'>
                  <div className=' bg-opacity-45 p-4 rounded-xl w-fit mx-auto'>
                    {selectedPokemon.name === "" && 
                      <p>No pokemon selected :(</p>
                    }
                    {(selectedPokemon.name !== "" && selectedPokemon.url === "") && 
                      <p>Pokemon with name '{selectedPokemon.name}' doesn't exist </p>
                    }

                    <p className='text-lg'>Type a pokemon name in the searchbar or click the random button to select a random pokemon</p>
                  </div>
            </div>
        :
        (
            <div className=''>
              {pokemonInfo !== EmptyPokemonLng ? (
                <div className='p-8 grid grid-cols-8 '>
                  <div className='lg:flex md:col-span-4 col-span-8 relative'>

                    {/* weight and height */}
                    <div className="flex  relative lg:w-1/4 md:items-center items-center  justify-between sm:mr-10">

                      <div className='flex h-full'>
                        {/* arrow on side */}
                        <div className="invisible lg:visible flex flex-col justify-between h-full items-center bg-red">
                          <div className=" w-0 h-0 lg:border-l-[15px] lg:border-r-[15px] lg:border-b-[30px] border-l-[5px] border-r-[5px] border-b-[10px] border-transparent border-b-[#2f3440]"></div> 
                          <div className="w-[2px] bg-[#2f3440] flex-grow"></div>
                          <div className="w-0 h-0 lg:border-l-[15px] lg:border-r-[15px] lg:border-t-[30px] border-l-[5px] border-r-[5px] border-t-[10px] border-transparent border-t-[#2f3440]"></div>
                        </div>


                        <div className='flex lg:items-center sm:items-center text-3xl'>
                          <p>{pokemonInfo.height} Cm</p>
                        </div>
                      </div>

                      <div className='lg:absolute right-2 top-2'>
                        <TextInLogo textInMiddle={pokemonInfo.weight.toString() + " Kg"} baseSize={100} />
                      </div>
                    </div>

                      {/* image and sprites */}
                      <div className=' lg:mt-12 pt-2 md:flex '>
                        {/* big img */}
                        <div className='xl:w-96 xl:h-96 md:w-80 md:h-80 sm:w-60 sm:h-60 w-40 h-40 sm:mx-auto ml-2 rounded-full border-2 border-primaryBlue p-8 nonSelectable overflow-hidden items-center flex'>
                          <img src={pokemonInfo.image} alt="Pokemon Artwork " className='object-scale-down'/>
                        </div>

                        {/* other sprites */}
                        {(pokemonIsOfficial && pokemonInfo.sprites.length > 0) &&
                          <div className='absolute xl:bottom-2 2xl:right-20 lg:bottom-14 md:bottom-0 bottom-0 md:right-0 right-12 flex items-end '>
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
                  <div className='md:col-span-4 col-span-8 p- space-y-4  '>
                    {/* name and types */}
                    <div className='text-left md:space-y-4  flex md:block items-center space-x-4 '>
                      <div className='flex items-center space-x-2'>
                        <p className='md:text-3xl text-xl font-semibold nonSelectable'>
                          {pokemonInfo.name}
                        </p>
                        {/* fav option */}
                        <animated.div className='text-2xl  hover:scale-110 text-primaryBlue' onClick={() => addOrRemoveFavourite()}
                          onMouseEnter={() => setStarAnimate(true)}
                          onMouseLeave={() => setStarAnimate(false)}
                          style={starAnimated}
                          >
                          {isUsersFavPokemon 
                            ? 
                              <FaStar />
                            :
                              <FaRegStar />
                        }
                        </animated.div>
                      </div>
                      <div className='md:w-2/3 flex space-x-4 '>
                        {pokemonInfo.types.map((type, index) => (
                          <div key={index} className='w-fit p-2 rounded-md border-2 border-primaryRed bg-lightBlue bg-opacity-20'>
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
                                              {abilityEffectName(ability.effect, index)}
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
                <div className='flex space-x-2 mx-auto w-fit text-xl my-8'>
                  <p>Loading pokemon</p>
                  <Loader />
                </div>

              )}
            </div>
          )
        }
    </div>
  )
}

export default PokemonInfo