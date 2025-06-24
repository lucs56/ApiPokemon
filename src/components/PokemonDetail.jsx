// src/components/PokemonDetail.jsx
export default function PokemonDetail({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#222',
          padding: '20px',
          borderRadius: '10px',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <h2>{pokemon.name.toUpperCase()}</h2>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p>Tipo: {pokemon.types.map(t => t.type.name).join(', ')}</p>
        <p>Altura: {pokemon.height / 10} m</p>
        <p>Peso: {pokemon.weight / 10} kg</p>
        <p>Habilidades:</p>
        <ul>
          {pokemon.abilities.map((ab) => (
            <li key={ab.ability.name}>{ab.ability.name}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
