export type PokemonListResult = {
    name: string;
    url: string;
};

export type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListResult[];
};

export type PokemonAbility = {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
};

export type PokemonType = {
    slot: number;
    type: {
        name: string;
        url: string;
    };
};

export type PokemonSprites = {
    front_default: string;
    other?: {
        'official-artwork'?: {
            front_default: string;
        };
    };
};

export type PokemonDetail = {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: PokemonAbility[];
    types: PokemonType[];
    sprites: PokemonSprites;
};
