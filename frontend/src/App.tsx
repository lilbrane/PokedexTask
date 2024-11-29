import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './Components/Home';
import Topbar from './Components/Topbar';
import axios from 'axios';
import PokemonInfo from './Components/PokemonInfo';
import {PokemonObjt} from "./pokemonShortObj.js"
import PokemonForm from './Components/PokemonForm';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonObjt>({name: "", url: ""});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getPokemon")

        setPokemon(response.data.data);
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
      <PokemonForm />
    </div>
  );
}

export default App;
