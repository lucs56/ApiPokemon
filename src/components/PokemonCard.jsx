// src/components/PokemonCard.jsx
export default function PokemonCard({ pokemon, onClick, isFavorite, onToggleFavorite }) {
  return (
    <div
      onClick={() => onClick(pokemon)}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        width: '130px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.7)', // Color claro y transparente
        color: '#222', // Texto oscuro para mejor contraste
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        transition: 'background 0.2s'
      }}
    >
      <img
        src={pokemon.sprites.front_default || "https://via.placeholder.com/96?text=No+Image"}
        alt={pokemon.name}
      />
      <p style={{ textTransform: 'capitalize', margin: '8px 0' }}>{pokemon.name}</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // para que no abra el modal al hacer click en el corazón
          onToggleFavorite(pokemon);
        }}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          border: 'none',
          background: 'transparent',
          fontSize: '18px',
          cursor: 'pointer',
          color: isFavorite ? 'red' : '#aaa',
        }}
        title="Favorito"
      >
        ❤️
      </button>
    </div>
  );
}
