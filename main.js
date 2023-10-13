// Get DOM elements
const generations = document.querySelectorAll('.gen');
const search = document.querySelector('#search');
const hint = document.querySelector('.text');
const numberOfSpecies = document.querySelector('.number');
const form = document.querySelector('form');
const info = document.querySelector('.cards');

form.classList.add('hide');
numberOfSpecies.classList.add('hide');
info.classList.add('hide');

let pokeData = [];

// Asynchronous function to get pokemon data
const fetchData = async (limit, offset, genId) => {
    await
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
            .then(res => res.json())
            .then(data => {
                const fetches = data.results?.map(item => {
                    return fetch(item.url)
                        .then(res => res.json())
                        .then(data => {
                            return {
                                id: data.id,
                                name: data.name,
                                img: data.sprites.other['official-artwork'].front_default,
                                types: data.types,
                                height: data.height,
                                weight: data.weight,
                            }
                        })
                    })
                Promise.all(fetches).then(res => {
                    pokeData = res;
                    pokeCards();
            });

            numberOfSpecies.textContent = `There are ${data.results?.length} Pokemon in generation ${genId}`;

            })

    pokeCards();
}

// Populate card with pokemon info
const pokeCards = () => {

    const cards = pokeData?.map(pokemon => {
        return `
        <div class="card">
            <div class="id">
            <p>${pokemon.id}</p>
            </div>
            <div class="top-section">
            <img
                src="${pokemon.img}"
                alt="${pokemon.name}"
            />
            </div>
            <div class="bottom-section">
            <h2 class="name">${pokemon.name}</h2>
            <p class="type">${pokemon.types?.map(type => getType(type)).join(', ')}</p>
            <div class="mass">
                <p>${pokemon.height * 10}cm</p>
                <p>${pokemon.weight / 10}kg</p>
            </div>
            </div>
        </div>
            `
    }).join('');

    info.innerHTML = cards;
}

// Helper function to get pokemon type
const getType = (type) => {
    return `${type.type.name}`;
}

// Populate cards with Pokemon data based on search criteria
const displayPokemon = (pokemon) => {
    const searchCriteria = pokemon
        ?.map((pokemon) => {
            return `
            <div class="card">
            <div class="id">
            <p>${pokemon.id}</p>
            </div>
            <div class="top-section">
            <img
                src="${pokemon.img}"
                alt="${pokemon.name}"
            />
            </div>
            <div class="bottom-section">
            <h2 class="title">${pokemon.name}</h2>
            <p class="title">${pokemon.types?.map(type => getType(type)).join(', ')}</p>
            <p>${pokemon.height}</p>
            <p>${pokemon.weight}</p>
            </div>
        </div>
        `;
        })
        .join('');
    info.innerHTML = searchCriteria;
}

// Implement search filter based on Pokemon name and type
search.addEventListener('keyup', e => {

    
    const searchString = e.target.value.toLowerCase();

    const filteredCharacters = pokeData?.filter(pokemon => {
        return pokemon.name.toLowerCase()?.includes(searchString) ||
            pokemon.types?.map(type => getType(type)).join(', ')?.includes(searchString);
    });
    displayPokemon(filteredCharacters);
});

// Populate cards based on selected Pokemon generation
generations.forEach(generation => {
    generation.addEventListener('click', function getPokemonByGeneration() {
        let genId = +generation.id;
        
        if (genId === 1) {
            limit = 151;
            offset = 0;
        } else if (genId === 2) {
            limit = 100;
            offset = 151;
        } else if (genId === 3) {
            limit = 135;
            offset = 252;
        } else if (genId === 4) {
            limit = 107;
            offset = 387;
        } else if (genId === 5) {
            limit = 156;
            offset = 494;
        } else if (genId === 6) {
            limit = 72;
            offset = 650;
        } else if (genId === 7) {
            limit = 88;
            offset = 722;
        } else if (genId === 8) {
            limit = 96;
            offset = 810;
        } else if (genId === 9) {
            limit = 112;
            offset = 906;
        }
        
        fetchData(limit, offset, genId)

        info.classList.remove('hide');
        hint.classList.add('hide');
        numberOfSpecies.classList.remove('hide');
        form.classList.remove('hide');
    });
});

fetchData();