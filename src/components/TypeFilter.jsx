// src/components/TypeFilter.jsx
const types = [
  'all', 'fire', 'water', 'grass', 'electric',
  'psychic', 'normal', 'fighting', 'ghost',
  'ground', 'rock', 'flying', 'bug', 'poison', 'dragon'
];

export default function TypeFilter({ selectedType, setSelectedType }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        style={{ padding: '8px', width: '200px' }}
      >
        {types.map((type) => (
          <option key={type} value={type}>
            {type.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
