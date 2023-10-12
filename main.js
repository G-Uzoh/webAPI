const info = document.querySelector('.cards');
const search = document.querySelector('#search');

let pokeData = [];

const fetchData = async () => {
    await
        fetch('https://pokeapi.co/api/v2/pokemon?limit=121&offset=0')
            .then(res => res.json())
            .then(data => {
                const fetches = data.results.map(item => {
                    return fetch(item.url)
                        .then(res => res.json())
                        .then(data => {
                            return {
                                id: data.id,
                                name: data.name,
                                img: data.sprites.other['official-artwork'].front_default,
                                types: data.types,
                                abilities: data.abilities
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
            <p class="title">${pokemon.types.map(type => getType(type)).join(', ')}</p>
            <p>${pokemon.abilities.map(ability => getAbility(ability)).join(', ')}</p>
            </div>
        </div>
            `
    }).join('');

    info.innerHTML = cards;

    /*
    <div class="card">
            <div class="id">
            <p>#1</p>
            </div>
            <div class="top-section">
            <img
                src="https://archives.bulbagarden.net/media/upload/3/3a/0039Jigglypuff.png"
                alt="pokemon"
            />
            </div>
            <div class="bottom-section">
            <p><span class="title">Name:</span> Jigglypuff</p>
            <p><span class="title">Type:</span> Normal, fairy</p>
            <p><span class="title">Ability:</span> Cute charm, competitive</p>
            </div>
    </div>
    */

}

const getType = (type) => {
    return `${type.type.name}`;
}

const getAbility = (ability) => {
    return `${ability.ability.name}`;
}

search.addEventListener('keyup', e => {

    
    const searchString = e.target.value.toLowerCase();

    const filteredCharacters = pokeData?.filter(pokemon => {
        return pokemon.name.toLowerCase()?.includes(searchString);
    });
    displayPokemon(filteredCharacters);
});

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
            <p class="title">${pokemon.types.map(type => getType(type)).join(', ')}</p>
            <p>${pokemon.abilities.map(ability => getAbility(ability)).join(', ')}</p>
            </div>
        </div>
        `;
        })
        .join('');
    info.innerHTML = searchCriteria;
};

fetchData();