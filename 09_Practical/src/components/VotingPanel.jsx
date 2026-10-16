import CandidateCard from "./CandidateCard";

function VotingPanel({
  candidates,
  selectedId,
  feedback,
  onSelect,
  onVote,
}) {
  return (
    <section className="panel voting-panel" aria-labelledby="candidate-heading">
      <div className="section-heading">
        <span className="step-number">01</span>
        <div>
          <h2 id="candidate-heading">Candidate Selection</h2>
          <p>Select one of the four fictional candidates.</p>
        </div>
      </div>

      <div className="candidate-grid">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={candidate.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="vote-actions">
        <button className="vote-button" type="button" onClick={onVote}>
          Cast Vote
          <span aria-hidden="true">→</span>
        </button>
        <p
          className={`feedback ${feedback.type}`}
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.text || "Your selection stays private on this demo screen."}
        </p>
      </div>
    </section>
  );
}

export default VotingPanel;
