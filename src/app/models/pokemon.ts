export interface Pokemon {
    id: number,
    name: string,
    height: number,
    pokemon_v2_pokemonabilities: any,
    pokemon_v2_pokemontypes: any,
    weight: number,
    img: string,
    types: any,
    abilities: any,
    pokemon_v2_pokemonstats: any,
    typesFormat: string,
    abilitiesFormat: string,
    hp: number,
    base_experience: number
}

export interface PokemonApiResponse {
    data: pokemonV2Pokemon;
    errors: any
}

export interface pokemonV2Pokemon {
    pokemon_v2_pokemon: Pokemon[]
}
