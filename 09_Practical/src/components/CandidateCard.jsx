function CandidateCard({ candidate, isSelected, onSelect }) {
  const initials = candidate.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <label className={`candidate-card${isSelected ? " selected" : ""}`}>
      <input
        type="radio"
        name="candidate"
        value={candidate.id}
        checked={isSelected}
        onChange={() => onSelect(candidate.id)}
      />
      <span className="candidate-avatar" aria-hidden="true">{initials}</span>
      <span className="candidate-details">
        <strong>{candidate.name}</strong>
        <span>{candidate.group}</span>
      </span>
      <span className="radio-visual" aria-hidden="true" />
      <span className="selection-text">
        {isSelected ? "Selected" : "Select"}
      </span>
    </label>
  );
}

export default CandidateCard;
