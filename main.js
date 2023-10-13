const generations = document.querySelectorAll('.gen');
const search = document.querySelector('#search');
const hint = document.querySelector('.hint');
console.log(hint)
const info = document.querySelector('.cards');

info.classList.add('hide');

let pokeData = [];

const fetchData = async (limit, offset) => {
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
            })

    pokeCards();
}

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
            <h2 class="title">${pokemon.name}</h2>
            <p class="title">${pokemon.types?.map(type => getType(type)).join(', ')}</p>
            <p>${pokemon.height}</p>
            <p>${pokemon.weight}</p>
            </div>
        </div>
            `
    }).join('');

    info.innerHTML = cards;
}

const getType = (type) => {
    return `${type.type.name}`;
}

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

search.addEventListener('keyup', e => {

    
    const searchString = e.target.value.toLowerCase();

    const filteredCharacters = pokeData?.filter(pokemon => {
        return pokemon.name.toLowerCase()?.includes(searchString) ||
            pokemon.types?.map(type => getType(type)).join(', ')?.includes(searchString);
    });
    displayPokemon(filteredCharacters);
});

generations.forEach(generation => {
    generation.addEventListener('click', function getGeneration() {
        let genId = parseInt(generation.id);
        
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
        fetchData(limit, offset)
        console.log(genId, limit, offset)
        info.classList.remove('hide');
        hint.classList.add('hide');
    });
});

fetchData();