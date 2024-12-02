import React, { useEffect, useState } from 'react';
import './App.css';
import Topbar from './Components/Topbar';
import axios from 'axios';
import PokemonInfo from './Components/PokemonInfo';
import {EmptyPokemon, PokemonObjt} from "./pokemonShortObj"
import PokemonForm from './Components/PokemonForm';

function App() {
  const [pokemon, setPokemon] = useState<PokemonObjt[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonObjt>(EmptyPokemon);

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

  return (
    <div className="App bg-primaryWhite">
      <Topbar availablePokemon={pokemon} selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}/>
      <PokemonInfo  selectedPokemon={selectedPokemon}/>
      <PokemonForm pokemonNames={pokemon} setPokemonNames={setPokemon}/>
    </div>
  );
}

export default App;
