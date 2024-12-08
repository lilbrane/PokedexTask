import React, { useEffect, useState } from 'react';
import './App.css';
import Topbar from './Components/Topbar';
import axios from 'axios';
import PokemonInfo from './Components/PokemonInfo';
import {EmptyPokemon, PokemonObjt} from "./pokemonShortObj"
import PokemonForm from './Components/PokemonForm';
import PokemonList from './Components/PokemonList';
import FavouritePokemon from './Components/FavouritePokemon';

function App() {
  const [pokemon, setPokemon] = useState<PokemonObjt[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonObjt>(EmptyPokemon);
  const [viewPokemon, setViewPokemon] = useState(true);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getPokemon")
        
        const updatedData = response.data.data.map((pokemon: PokemonObjt) => ({
          ...pokemon, 
          official: true,
        }));

        let savedPokemon: any[] = [];

        // getting pokemon from localstorage
        const localStoragePoke = localStorage.getItem("pokemons");
        if(localStoragePoke)
          savedPokemon = JSON.parse(localStoragePoke);



        setPokemon([...updatedData, ...savedPokemon]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const choosePokemon = (choosenPokemon: PokemonObjt) => {
    setScreen(0);
    setSelectedPokemon(choosenPokemon);
  }

  const screenOpt = []

  return (
    <div className="App bg-primaryWhite">
      <Topbar availablePokemon={pokemon} selectedPokemon={selectedPokemon} choosePokemon={choosePokemon} setScreen={setScreen} activeScreen={screen}/>
      { 
        screen === 0 &&
        <section>
          <PokemonInfo  selectedPokemon={selectedPokemon}/>
          <PokemonForm pokemonNames={pokemon} setPokemonNames={setPokemon}/>
        </section>    
      }
      {
        screen === 1 &&
          <PokemonList availablePokemon={pokemon} setAvailablePokemon={setPokemon} choosePokemon={choosePokemon}/>
      }
      {
        screen === 2 &&
        <FavouritePokemon choosePokemon={choosePokemon}/>
      }
    </div>
  );
}

export default App;
