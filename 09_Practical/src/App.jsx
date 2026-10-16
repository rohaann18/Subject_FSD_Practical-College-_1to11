import { useEffect, useState } from "react";
import VotingPanel from "./components/VotingPanel";
import ResultsPanel from "./components/ResultsPanel";

const STORAGE_KEY = "votesphere-candidates";

const defaultCandidates = [
  { id: 1, name: "Aarav Shah", group: "Unity Group", votes: 0 },
  { id: 2, name: "Meera Patel", group: "Progress Group", votes: 0 },
  { id: 3, name: "Kabir Mehta", group: "Vision Group", votes: 0 },
  { id: 4, name: "Riya Desai", group: "Future Group", votes: 0 },
];

function loadCandidates() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!Array.isArray(saved)) return defaultCandidates;

    return defaultCandidates.map((candidate) => {
      const storedCandidate = saved.find((item) => item.id === candidate.id);
      const savedVotes = storedCandidate?.votes;

      return {
        ...candidate,
        votes:
          Number.isInteger(savedVotes) && savedVotes >= 0
            ? savedVotes
            : candidate.votes,
      };
    });
  } catch {
    return defaultCandidates;
  }
}

function App() {
  const [candidates, setCandidates] = useState(loadCandidates);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

  const totalVotes = candidates.reduce(
    (total, candidate) => total + candidate.votes,
    0,
  );

  function handleSelect(candidateId) {
    setSelectedId(candidateId);
    setFeedback({ type: "", text: "" });
  }

  function handleVote() {
    if (selectedId === null) {
      setFeedback({
        type: "error",
        text: "Please select a candidate before voting.",
      });
      return;
    }

    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === selectedId
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate,
      ),
    );
    setSelectedId(null);
    setFeedback({ type: "success", text: "Your vote has been recorded." });
  }

  function handleReset() {
    const shouldReset = window.confirm(
      "Reset all VoteSphere election results?",
    );

    if (!shouldReset) return;

    setCandidates(defaultCandidates.map((candidate) => ({ ...candidate })));
    setSelectedId(null);
    setFeedback({
      type: "success",
      text: "Election results have been reset.",
    });
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span className="brand-name">VoteSphere</span>
          <span className="demo-badge">Demo</span>
        </div>
        <p className="eyebrow">Campus voices, counted clearly</p>
        <h1>Student Council Election</h1>
        <p className="hero-copy">Choose one candidate and cast your vote.</p>
      </header>

      <section className="workspace" aria-label="Voting workspace">
        <VotingPanel
          candidates={candidates}
          selectedId={selectedId}
          feedback={feedback}
          onSelect={handleSelect}
          onVote={handleVote}
        />

        <ResultsPanel candidates={candidates} totalVotes={totalVotes} />
      </section>

      <footer className="page-footer">
        <div>
          <strong>Classroom demonstration</strong>
          <p>Votes are saved only in this browser using localStorage.</p>
        </div>
        <button className="reset-button" type="button" onClick={handleReset}>
          Reset Election
        </button>
      </footer>
    </main>
  );
}

export default App;
