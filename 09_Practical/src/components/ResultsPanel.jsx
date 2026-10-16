function ResultsPanel({ candidates, totalVotes }) {
  const highestVotes = Math.max(...candidates.map((candidate) => candidate.votes));
  const leaders = candidates.filter(
    (candidate) => candidate.votes === highestVotes,
  );

  let resultSummary = "No votes cast yet.";
  if (totalVotes > 0 && leaders.length === 1) {
    resultSummary = `Currently Leading: ${leaders[0].name}`;
  } else if (totalVotes > 0) {
    resultSummary = "Current Result: Tie";
  }

  return (
    <section className="panel results-panel" aria-labelledby="results-heading">
      <div className="results-topline">
        <div className="section-heading">
          <span className="step-number teal">02</span>
          <div>
            <h2 id="results-heading">Live Results</h2>
            <p>Updates instantly after every vote.</p>
          </div>
        </div>
        <div className="total-card">
          <span>Total Votes</span>
          <strong>{totalVotes}</strong>
        </div>
      </div>

      <div className="result-list">
        {candidates.map((candidate) => {
          const percentage =
            totalVotes === 0
              ? 0
              : Math.round((candidate.votes / totalVotes) * 100);

          return (
            <div className="result-item" key={candidate.id}>
              <div className="result-labels">
                <div>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.votes} {candidate.votes === 1 ? "vote" : "votes"}</span>
                </div>
                <strong className="percentage">{percentage}%</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label={`${candidate.name}: ${percentage}%`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={percentage}
              >
                <span className="progress-fill" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="leader-summary" aria-live="polite">
        <span aria-hidden="true">●</span>
        {resultSummary}
      </p>
    </section>
  );
}

export default ResultsPanel;
