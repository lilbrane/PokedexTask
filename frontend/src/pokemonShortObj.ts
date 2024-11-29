export interface PokemonObjt {
    name: string,
    url: string
  }

  export interface PokemonObjtLong {
    name: string,
    height: number
    weight: number
    image: string
    abilities: [{
      name: string,
      effect: string
    }]
  }
 
  export const EmptyPokemon: PokemonObjt = {
    name: "",
    url: ""
  };

  export const EmptyPokemonLng: PokemonObjtLong = {
    name: "",
    height: 0,
    weight: 0,
    image: "",
    abilities: [{
      name: "",
      effect: ""
    }]
  }