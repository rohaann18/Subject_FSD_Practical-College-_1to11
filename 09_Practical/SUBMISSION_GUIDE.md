# VoteSphere — College Practical Submission Guide

## 1. Final Project Status

VoteSphere is a complete, working frontend ReactJS voting application for the practical question: “Write a program to create a voting application using React JS.”

It is intentionally a classroom demonstration, not a secure real-world election system. It allows repeated voting so the faculty can test the result calculations easily.

## 2. Files Created

```text
voting-app/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── SUBMISSION_GUIDE.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    └── components/
        ├── CandidateCard.jsx
        ├── VotingPanel.jsx
        └── ResultsPanel.jsx
```

Vite also creates `dist/` after a production build. `node_modules/` contains installed packages.

## 3. Packages Installed

- React 19.3.0
- React DOM 19.3.0
- Vite 8.3.3
- Vite React plugin 6.1.2

No external UI, state-management, routing, chart, database, or backend package is used.

## 4. Printable Source Line Count

| File | Lines |
|---|---:|
| `src/main.jsx` | 10 |
| `src/App.jsx` | 129 |
| `src/App.css` | 391 |
| `src/components/CandidateCard.jsx` | 29 |
| `src/components/VotingPanel.jsx` | 48 |
| `src/components/ResultsPanel.jsx` | 69 |
| **Total** | **676** |

Estimated length: approximately 9–10 A4 pages using the print settings below.

## 5. React Design

### Components

- `App`: owns candidate state, selection, messages, vote/reset handlers, total calculation, localStorage, and page layout.
- `VotingPanel`: renders candidate selection, the Cast Vote button, and feedback.
- `CandidateCard`: displays one labeled radio option using props.
- `ResultsPanel`: shows total votes, counts, percentages, bars, leader, or tie.

### Hooks

- `useState`: stores candidates, selected candidate ID, and feedback.
- `useEffect`: saves candidates to localStorage whenever candidate state changes.

## 6. Core Features and Logic

- Exactly four fictional candidates are displayed.
- A radio group permits one selection at a time.
- Empty submission displays an inline validation message.
- Voting uses an immutable `map()` update and increments only the selected ID.
- The selection clears after a successful vote.
- `reduce()` calculates the total.
- Percentages and CSS progress bars update immediately.
- The highest count determines the leader; equal highest counts produce a tie.
- A guarded zero-vote case prevents `NaN` and `Infinity`.
- localStorage preserves counts after refresh.
- Reset uses `window.confirm()`, restores zero counts, and persists the reset.

### Percentage Formula

```text
percentage = (candidateVotes / totalVotes) × 100
```

If `totalVotes === 0`, percentage is set to 0. Otherwise VoteSphere rounds it with `Math.round()`.

## 7. Verification Report

### Functional Test Matrix

| # | Test | Result |
|---:|---|---|
| 1 | Application loads | PASS |
| 2 | Four candidates display | PASS |
| 3 | Radio selection works | PASS |
| 4 | Only one candidate is selectable | PASS |
| 5 | Vote without selection is blocked | PASS |
| 6 | Cast Vote works | PASS |
| 7 | Correct candidate increments by exactly 1 | PASS |
| 8 | Selection resets after voting | PASS |
| 9 | Total votes are correct | PASS |
| 10 | Percentages are correct | PASS |
| 11 | Zero-vote calculation is safe | PASS |
| 12 | Progress bars match percentages | PASS |
| 13 | Single leader is correct | PASS |
| 14 | Tie detection is correct | PASS |
| 15 | localStorage saves vote state | PASS |
| 16 | Refresh preserves votes | PASS |
| 17 | Reset returns all values to zero | PASS |
| 18 | Reset remains after refresh | PASS |
| 19 | 1366px desktop layout | PASS |
| 20 | 768px tablet layout | PASS |
| 21 | 375px mobile layout | PASS |

Known calculation test passed with Aarav 2, Meera 1, Kabir 1, Riya 0: total 4 and percentages 50%, 25%, 25%, 0%.

### Quality Status

- Desktop: PASS — balanced two-panel workspace with no horizontal overflow.
- Tablet: PASS — panels stack cleanly and candidate cards remain in two columns.
- Mobile: PASS — candidate cards stack, controls use full available width, and no horizontal overflow occurs.
- Accessibility: PASS — labeled radio controls, text selection state, visible focus, semantic headings, readable contrast, live feedback, and text values beside progress bars.
- React practices: PASS — functional components, props, hooks, immutable updates, unique keys, `map()`, and `reduce()`; no manual DOM manipulation.
- Browser console: PASS — no app-caused warnings or errors.
- Production build: PASS — `npm run build` completed successfully.
- Security audit: PASS — `npm audit` reported 0 vulnerabilities.

### Genuine Problems Found and Fixed

The first stylesheet formatting produced 816 printable lines. CSS formatting was compacted without removing functionality, reducing the important source to 676 lines. Runtime and development dependencies were also placed in their standard package sections. No remaining functional defect was found.

## 8. Xerox Instructions

### Print These

1. `src/main.jsx`
2. `src/App.jsx`
3. `src/App.css`
4. `src/components/CandidateCard.jsx`
5. `src/components/VotingPanel.jsx`
6. `src/components/ResultsPanel.jsx`

Optional if faculty asks: `package.json`.

Do not print `node_modules/`, `package-lock.json`, `dist/`, or Vite cache files.

### Recommended Print Settings

- Paper: A4
- Orientation: Portrait
- Font: Consolas or Courier New
- Font size: 9–10 pt
- Margins: 12–15 mm
- Line numbers: Off unless faculty asks
- Header/footer: Minimal or disabled
- Colour: Black and white is sufficient
- Sides: One-sided is recommended for checking
- Estimated pages: approximately 9–10

## 9. VS Code Run Instructions

1. Open the `voting-app` folder in VS Code.
2. Choose **Terminal > New Terminal**.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the exact **Local** URL printed by Vite. It often looks like `http://localhost:5173`, but another port may be selected.

To verify a production build, run `npm run build`.

## 10. Run on Another Computer

1. Copy the `voting-app` folder; `node_modules` does not need to be copied.
2. Install the current Node.js LTS version.
3. Open the copied folder in VS Code.
4. Open a terminal and run `npm install`.
5. Run `npm run dev`.
6. Open the exact Local URL shown by Vite.

`npm install` recreates `node_modules` from `package.json` and `package-lock.json`.

## 11. Application Flow for Viva

```text
User
  ↓
React UI
  ↓
VotingPanel
  ↓
Candidate Selection
  ↓
Cast Vote
  ↓
App.jsx State Update
  ↓
ResultsPanel
  ↓
localStorage
```

```text
Vote Action → React Event Handler → Candidate ID
→ Immutable Vote Update → setState → React Re-render
→ useEffect → JSON.stringify() → localStorage Save
```

Easy Hinglish: User radio button se candidate select karta hai. Cast Vote event `App.jsx` ke handler ko selected ID deta hai. Handler sirf matching candidate ka vote badhata hai. State change ke baad React UI dobara render karta hai aur `useEffect` data ko browser me save karta hai.

## 12. localStorage Flow

```text
Application opens → localStorage read → JSON.parse()
→ React state → UI

Vote state changes → useEffect → JSON.stringify()
→ localStorage save
```

Easy Hinglish: Page open hote time saved JSON ko object array me convert karke state banate hain. Vote change hone par array ko JSON string me convert karke save karte hain, isliye refresh ke baad votes remain karte hain.

## 13. Important File Explanations

- `main.jsx`: React application ko HTML ke `root` element me render karta hai.
- `App.jsx`: Main state, vote/reset functions, localStorage, total, aur layout handle karta hai.
- `App.css`: Complete original styling, progress bars, focus styles, and responsive rules rakhta hai.
- `CandidateCard.jsx`: Ek candidate ka radio card props se display karta hai.
- `VotingPanel.jsx`: Candidate cards, Cast Vote button, aur feedback dikhata hai.
- `ResultsPanel.jsx`: Counts, percentages, progress bars, leader, aur tie dikhata hai.

## 14. Important React Concepts

- **ReactJS:** Component-based JavaScript library for building user interfaces.
- **Component:** UI ka reusable independent part.
- **Functional Component:** JavaScript function jo JSX return karta hai.
- **Props:** Parent se child component ko milne wala read-only data.
- **State:** Component ka changeable data.
- **useState:** Functional component me state banane aur update karne ka Hook.
- **useEffect:** Render ke baad side effect chalata hai; yahan localStorage save karta hai.
- **JSX:** JavaScript ke andar HTML-like UI syntax.
- **Event Handling:** Click/change jaise user actions ko functions se handle karna.
- **Conditional Rendering:** Condition ke according different message/UI dikhana.
- **map():** Candidate array se cards/results banana ya immutable update karna.
- **reduce():** Sab votes ko jodkar one total banana.
- **localStorage:** Browser me persistent key-value storage.
- **JSON.stringify():** JavaScript data ko JSON string me convert karta hai.
- **JSON.parse():** JSON string ko JavaScript data me convert karta hai.
- **Virtual DOM:** React ka lightweight UI representation; React sirf necessary real DOM updates karta hai.

## 15. Thirty Viva Questions and Answers

1. **What is ReactJS?** ReactJS is a JavaScript library for component-based user interfaces.
2. **Why use React?** It makes interactive UI reusable, declarative, and easy to update.
3. **What is JSX?** JSX lets us write HTML-like syntax inside JavaScript.
4. **What is a component?** A component is a reusable part of the UI.
5. **What is a functional component?** It is a JavaScript function that returns JSX.
6. **What are props?** Props are read-only values passed from parent to child.
7. **What is state?** State is data that can change and update the UI.
8. **Props vs state?** Props come from a parent; state is managed inside a component.
9. **What is useState?** It is a Hook used to create and update state.
10. **What is useEffect?** It is a Hook for side effects after rendering.
11. **Why use useEffect here?** It saves changed candidate data to localStorage.
12. **What is event handling?** It runs a function for an action like click or change.
13. **What is conditional rendering?** It shows different UI according to a condition.
14. **Why use map()?** It renders every candidate and performs immutable updates.
15. **Why does React require a key?** A key uniquely identifies list items for efficient updates.
16. **What is reduce()?** It combines array values; here it sums all votes.
17. **How are total votes calculated?** All candidate vote counts are added with `reduce()`.
18. **How is percentage calculated?** Candidate votes divided by total votes, multiplied by 100.
19. **How is empty voting prevented?** The handler checks whether `selectedId` is null.
20. **How is the selected candidate stored?** Its numeric ID is stored in React state.
21. **How is a vote increased?** `map()` creates a new array and adds one to the matching ID.
22. **What is localStorage?** It is browser storage that remains after refresh.
23. **Why use localStorage?** This frontend-only practical needs simple persistence without a backend.
24. **What is JSON.stringify()?** It converts the candidate array into a storable string.
25. **What is JSON.parse()?** It converts the saved string back into JavaScript data.
26. **How do votes survive refresh?** They are read from localStorage in the initial state function.
27. **How is the leader calculated?** The app finds the highest votes and candidates with that value.
28. **How is a tie detected?** More than one candidate sharing the highest count means a tie.
29. **Why is there no backend?** The practical only needs a React demo; localStorage meets its scope.
30. **Explain the VoteSphere flow.** Select candidate, click vote, validate ID, update state, re-render results, and save through useEffect.

## 16. Practical Write-up

### A. Practical Name

Voting Application using ReactJS — VoteSphere

### B. Aim

To develop a responsive ReactJS voting application where a user selects a candidate, casts a vote, views calculated results, and preserves vote counts using localStorage.

### C. Technologies Used

ReactJS, Vite, JavaScript, JSX, CSS, and browser localStorage.

### D. Software Requirements

Node.js LTS, npm, VS Code, and a modern web browser.

### E. Functional Requirements

Display four candidates; allow one selection; validate submission; increment the correct count; show totals, percentages, progress bars, leader/tie; save results; and reset the demo.

### F. React Components

`App`, `VotingPanel`, `CandidateCard`, and `ResultsPanel`.

### G. Working

The user selects a radio card and clicks Cast Vote. React validates and updates the chosen candidate immutably. Results re-render immediately and localStorage saves the new state.

### H. Voting Logic

If no ID is selected, show validation. Otherwise map through candidates and increase only the candidate whose ID matches `selectedId`.

### I. localStorage Usage

Saved data is loaded with `JSON.parse()`. Candidate state is saved under `votesphere-candidates` with `JSON.stringify()`.

### J. Expected Output

A modern one-page election interface showing four candidate choices, live vote totals, percentages, progress bars, and current leader/tie status.

### K. Result

VoteSphere was created and tested successfully using ReactJS. All required voting, calculation, persistence, reset, accessibility, and responsive features work correctly.

## 17. Algorithm

1. Start the React application.
2. Load saved voting data from localStorage.
3. Display candidates.
4. Let the user select one candidate.
5. Let the user click Cast Vote.
6. Validate candidate selection.
7. Find the selected candidate.
8. Increase the selected candidate vote by one.
9. Update React state.
10. Calculate total votes.
11. Calculate vote percentages.
12. Determine the leader or tie.
13. Save voting data to localStorage.
14. Display updated results.
15. Allow reset of the demo election.
16. Stop when the application closes.

## 18. Exact Practical-Requirement Verification

- A. Uses ReactJS — PASS
- B. Candidates display — PASS
- C. User can select one candidate — PASS
- D. User can cast a vote — PASS
- E. Invalid vote is prevented — PASS
- F. Correct candidate receives the vote — PASS
- G. Total votes are calculated — PASS
- H. Percentages are calculated safely — PASS
- I. Results display — PASS
- J. Leader/tie is calculated — PASS
- K. Votes persist after refresh — PASS
- L. Reset works and persists — PASS
- M. Responsive design works — PASS
- N. React best practices are followed — PASS
- O. UI is original and independently designed — PASS
- P. Important source is suitable for Xerox — PASS (676 lines)

**FINAL STATUS: PASS — VoteSphere is ready for ReactJS college practical submission.**
