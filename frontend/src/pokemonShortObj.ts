export interface PokemonObjt {
    name: string,
    url: string
  }

  export interface PokemonObjtLong {
    name: string,
    height: number
    weight: number
    image: string
    types: string[]
    abilities: [{
      name: string,
      effect: string
    }]
    sprites: [{
      gen: string,
      type: string,
      sprite: string
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
    types: [],
    abilities: [{
      name: "",
      effect: ""
    }],
    sprites: [{
      gen: "",
      type: "",
      sprite: ""
    }]
  }