import { useEffect, useState } from 'react';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import TypeFilter from './components/TypeFilter';

function App() {
  const backgroundUrl = "https://wallpapers.com/images/featured/pokemon-hd-fazqcs1tmwwte1ap.jpg";

  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [error, setError] = useState(null);

  const limit = 20;

  const fetchPokemons = async () => {
    setLoading(true);
    setError(null);
    console.log("Llamando API con offset:", offset);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error('No se pudo obtener la lista');
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const res = await fetch(pokemon.url);
            if (!res.ok) throw new Error();
            return await res.json();
          } catch {
            console.warn(`Error al obtener detalles de ${pokemon.name}`);
            return null;
          }
        })
      );

      setPokemonList(detailed.filter(p => p !== null));
    } catch (error) {
      setError(error.message);
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]); // ✅ ahora se reactiva al cambiar offset

  const handleSearch = async () => {
    if (search.trim() === '') {
      setOffset(0); // ✅ reinicia la paginación
      fetchPokemons();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (!res.ok) {
        setPokemonList([]);
        setError('No se encontró el Pokémon');
      } else {
        const data = await res.json();
        setPokemonList([data]);
      }
    } catch {
      setPokemonList([]);
      setError('Error al buscar el Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (pokemon) => {
    const updatedFavorites = favorites.some(p => p.id === pokemon.id)
      ? favorites.filter(p => p.id !== pokemon.id)
      : [...favorites, pokemon];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredList =
    selectedType === 'all'
      ? pokemonList
      : pokemonList.filter(p =>
          p.types.some(t => t.type.name === selectedType)
        );

  // Depuración
  console.log('Offset:', offset);
  console.log('Filtrados:', filteredList.map(p => p.name));

  return (
    <div
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="pokeball" width="40" height="40" />
        <span style={{ color: '#FFCB05' }}>Pokémon</span>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="pokeball" width="40" height="40" />
      </h1>

      {/* Búsqueda */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '200px', borderRadius: '8px', border: '1px solid #FFCB05', outline: 'none' }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: '10px',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #FFCB05 60%, #3B4CCA 100%)',
            color: '#222',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'background 0.2s'
          }}
        >
          Buscar
        </button>
      </div>

      {/* Filtro por tipo */}
      <div style={{ textAlign: 'center' }}>
        <TypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      {/* Paginación */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <button
          onClick={() => {
            const newOffset = Math.max(0, offset - limit);
            console.log("Retrocediendo a offset:", newOffset);
            setOffset(newOffset);
          }}
          disabled={offset === 0}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: offset === 0 ? '#ccc' : 'linear-gradient(90deg, #3B4CCA 60%, #FFCB05 100%)',
            color: offset === 0 ? '#888' : '#fff',
            fontWeight: 'bold',
            cursor: offset === 0 ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            transition: 'background 0.2s'
          }}
        >
          ← Anterior
        </button>
        <span style={{ margin: '0 10px', fontWeight: 'bold', color: '#FFCB05', fontSize: '1.1rem', textShadow: '1px 1px 2px #222' }}>
          Página: {offset / limit + 1}
        </span>
        <button
          onClick={() => {
            const newOffset = offset + limit;
            console.log("Avanzando a offset:", newOffset);
            setOffset(newOffset);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #3B4CCA 60%, #FFCB05 100%)',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            transition: 'background 0.2s'
          }}
        >
          Siguiente →
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <h3 style={{ color: 'red', textAlign: 'center' }}>{error}</h3>}

      {/* Lista de Pokémon */}
      {loading ? (
        <h2 style={{ textAlign: 'center' }}>Cargando...</h2>
      ) : filteredList.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {filteredList.map((poke) => (
            <PokemonCard
              key={poke.id}
              pokemon={poke}
              onClick={setSelectedPokemon}
              isFavorite={favorites.some(f => f.id === poke.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <h3 style={{ textAlign: 'center' }}>No se encontraron resultados</h3>
      )}

      {/* Detalle en modal */}
      <PokemonDetail pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />

      {/* Favoritos */}
      <div style={{ marginTop: '40px' }}>
        <h2>❤️ Tus Favoritos</h2>
        {favorites.length === 0 ? (
          <p>No tenés favoritos aún.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {favorites.map((poke) => (
              <PokemonCard
                key={poke.id}
                pokemon={poke}
                onClick={setSelectedPokemon}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', marginTop: 40, color: '#FFCB05' }}>
        Hecho por [Lucas Sosa, Emiliano Vilches] &copy; 2025
        <br />
        <strong>Pokémon mostrados:</strong> {filteredList.length} &nbsp;|&nbsp;
        <strong>Favoritos:</strong> {favorites.length}
      </footer>
    </div>
  );
}

export default App;
