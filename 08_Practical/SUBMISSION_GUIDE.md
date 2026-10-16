# TaskFlow — ReactJS College Practical Submission Guide

## 1. Final project status

TaskFlow is a complete, local-only React Todo application. It supports adding, viewing, completing, uncompleting, editing, deleting, filtering, counting, clearing completed tasks, validation, empty states, responsive layouts, and browser `localStorage` persistence.

## 2. Project and technology

- Project folder: `todo-list-app`
- App name: TaskFlow
- Tagline: "Organize today. Accomplish more."
- Stack: ReactJS, Vite, JavaScript, CSS, browser localStorage
- Packages: React, React DOM, Vite, and the official Vite React plugin only
- Hooks: `useState` and `useEffect`

## 3. Project structure

```text
todo-list-app/
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
        ├── TodoForm.jsx
        ├── TodoList.jsx
        └── TodoItem.jsx
```

Generated folders such as `node_modules` and `dist` are not source code.

## 4. Important source line count

| File | Lines |
|---|---:|
| `src/main.jsx` | 10 |
| `src/App.jsx` | 123 |
| `src/App.css` | 370 |
| `src/components/TodoForm.jsx` | 50 |
| `src/components/TodoList.jsx` | 37 |
| `src/components/TodoItem.jsx` | 90 |
| **Total important source** | **680** |

At 9–10 pt with 12–15 mm margins, this is approximately 9–10 A4 pages, depending on the editor's print spacing and wrapping.

## 5. Component responsibilities

- `main.jsx`: Finds the root HTML element and renders the React app in `StrictMode`.
- `App.jsx`: Owns todo state, filter state, localStorage, all state-changing functions, count calculation, and the main layout.
- `App.css`: Contains the original TaskFlow visual design, states, focus styles, and responsive rules.
- `TodoForm.jsx`: Controls the new-task input, trims it, validates it, and submits valid text.
- `TodoList.jsx`: Shows filtered todos or the correct empty-state message.
- `TodoItem.jsx`: Displays one todo and handles checkbox, edit, save, cancel, and delete controls.

## 6. Functional test matrix

| # | Test | Status | Verified result |
|---:|---|---|---|
| 1 | Add Todo | PASS | Valid trimmed task appears |
| 2 | Empty validation | PASS | Inline error; no task added |
| 3 | Whitespace validation | PASS | Rejected; no task added |
| 4 | Complete Todo | PASS | Checkbox, strike-through, and count update |
| 5 | Uncomplete Todo | PASS | Task becomes active again |
| 6 | Edit Todo | PASS | Updated trimmed text appears |
| 7 | Empty edit protection | PASS | Inline error; edit mode remains open |
| 8 | Delete Todo | PASS | Immutable `filter()` removes only matching ID |
| 9 | All filter | PASS | Shows every task |
| 10 | Active filter | PASS | Shows only `completed === false` |
| 11 | Completed filter | PASS | Shows only `completed === true` |
| 12 | Active counter | PASS | Correct singular/plural active count |
| 13 | Clear Completed | PASS | Removes completed tasks, preserves active tasks |
| 14 | Empty state | PASS | Correct first-task guidance appears |
| 15 | Filter empty state | PASS | Correct filter-specific message appears |
| 16 | localStorage save | PASS | State saved under `taskflow-todos` |
| 17 | Refresh persistence | PASS | Todos remain after reload |
| 18 | Completed persistence | PASS | Checked state remains after reload |
| 19 | Edited persistence | PASS | Edited text remains after reload |
| 20 | Responsive layout | PASS | No horizontal overflow at tested sizes |

Browser tests used the example tasks, checked and unchecked a task, edited text, reloaded the page, exercised filters and validation, and used a long wrapping task. Delete and Clear Completed were verified from their direct immutable state transitions and persistence effect.

## 7. Quality verification

- Production build: PASS (`vite build`)
- Browser console errors/warnings caused by the app: none found
- npm audit: 0 vulnerabilities
- Desktop at 1366 px: PASS
- Tablet at 768 px: PASS
- Mobile at 375 px: PASS
- Long text wrapping: PASS
- Accessibility: labelled input, contextual checkbox names, semantic buttons/list, visible keyboard focus, readable contrast, and strike-through plus checkbox for completed state
- React practices: functional components, props, controlled inputs, immutable `map()`/`filter()` updates, unique keys, no manual DOM manipulation, and safe lazy localStorage loading
- Genuine fix during review: stylesheet formatting was compacted from an 822-line print set to 680 lines without minifying or changing the UI

## 8. Xerox recommendation

### Print these

1. `src/App.jsx`
2. `src/App.css`
3. `src/components/TodoForm.jsx`
4. `src/components/TodoList.jsx`
5. `src/components/TodoItem.jsx`
6. `src/main.jsx`

### Optional if faculty requires

- `package.json` — shows scripts and project dependencies.

### Do not print

- `node_modules` — downloaded dependency code, not your application source.
- `package-lock.json` — generated dependency lock data.
- `dist` — generated production output.
- Vite caches/generated files — not handwritten practical code.

### Print settings

- Paper: A4
- Orientation: Portrait
- Font: Consolas or Courier New
- Font size: 9–10 pt (never below 9 pt)
- Margins: 12–15 mm
- Line numbers: Off unless faculty asks
- Header/footer: Minimal or disabled
- Colour: Black-and-white is sufficient
- Printing: One-sided is easiest for faculty checking

## 9. Run in VS Code

1. Open the `todo-list-app` folder in VS Code.
2. Choose **Terminal > New Terminal**.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the exact **Local** URL printed by Vite in the terminal. It is often similar to `http://localhost:5173`, but Vite may select another port.
6. Stop the server later with `Ctrl + C` in the terminal.

To verify a production build, run `npm run build`.

## 10. Run on another computer

1. Copy the complete `todo-list-app` folder. `node_modules` does not need to be copied.
2. Install the current Node.js LTS version.
3. Open the copied folder in VS Code.
4. Open a terminal and run `npm install`.
5. Run `npm run dev`.
6. Open the exact Local URL printed by Vite.

`npm install` recreates `node_modules` using `package.json` and `package-lock.json`.

## 11. Application flow for viva (easy Hinglish)

```text
User
  ↓
React UI
  ↓
TodoForm
  ↓
App.jsx State
  ↓
TodoList
  ↓
TodoItem
  ↓
localStorage
```

User task enter karta hai. `TodoForm` input validate karke `App.jsx` ko text deta hai. `App.jsx` main state update karta hai. `TodoList` state ko list mein render karta hai aur `TodoItem` har individual task dikhata hai. Updated todos `localStorage` mein save ho jaate hain.

For every update:

```text
User Action → Event Handler → setState → React Re-render
            → useEffect → localStorage Update
```

User checkbox, edit, delete, ya clear button use karta hai. Event handler immutable state update karta hai. React naya UI render karta hai. `useEffect` latest array ko JSON mein convert karke save karta hai.

## 12. localStorage flow for viva

When the app opens:

```text
localStorage → JSON.parse() → useState receives todos → UI displays todos
```

App start hote waqt `loadTodos()` saved `taskflow-todos` value read karta hai. Valid array mile to state initialize hoti hai; missing or invalid data par empty array use hota hai.

When a todo changes:

```text
React state changes → useEffect runs → JSON.stringify()
                    → localStorage saves latest todos
```

Isliye refresh ke baad text aur completed status dono remain karte hain.

## 13. Important React concepts

- **Component:** UI ka reusable part; example `TodoForm`.
- **Props:** Parent component se child ko bheja gaya read-only data/function.
- **State:** Component ka changing data jo UI ko control karta hai.
- **useState:** Functional component mein state banata aur update karta hai.
- **useEffect:** State change ke baad side effect chalata hai; yahan localStorage save.
- **Event handling:** Click, submit, change jaise user actions ko functions se handle karna.
- **Conditional rendering:** Condition ke hisab se list, empty state, ya edit UI dikhana.
- **map():** Array ke har todo ko React element mein convert karna.
- **filter():** Matching tasks select karna ya selected task remove karna.
- **localStorage:** Browser ka device-local key/value storage.
- **JSON.stringify():** JavaScript data ko storage-ready string banana.
- **JSON.parse():** Stored JSON string ko JavaScript data banana.
- **Controlled input:** Input value React state se controlled hoti hai.
- **Virtual DOM:** React ki lightweight UI representation used for efficient updates.

## 14. Thirty viva questions and answers

1. **What is ReactJS?**  
   ReactJS ek JavaScript library hai jo component-based user interfaces banati hai.

2. **Why is React used?**  
   Reusable components aur efficient UI updates ki wajah se code easy to manage hota hai.

3. **What is a component?**  
   Component UI ka independent reusable part hota hai, jaise `TodoForm`.

4. **What is a functional component?**  
   JavaScript function jo props leta hai aur JSX return karta hai.

5. **What are props?**  
   Props parent se child component ko milne wala read-only data hai.

6. **What is state?**  
   State changing data hai; state update hone par React UI re-render karta hai.

7. **Difference between props and state?**  
   Props parent se aati hain; state component ke andar manage aur update hoti hai.

8. **What is useState?**  
   `useState` Hook functional component mein state create karta hai.

9. **What is useEffect?**  
   `useEffect` render/state change ke baad side effects run karta hai.

10. **Why is useEffect used here?**  
    Todo state change hone par latest todos localStorage mein save karne ke liye.

11. **What is JSX?**  
    JSX JavaScript ke andar HTML-like UI syntax hai.

12. **What is Virtual DOM?**  
    Real DOM ka lightweight copy, jisse React required changes efficiently apply karta hai.

13. **What is event handling in React?**  
    `onClick`, `onChange`, and `onSubmit` se user actions handle karna.

14. **What is a controlled input?**  
    Input jiska value React state se aata aur `onChange` se update hota hai.

15. **Why do we use map()?**  
    Todo array ke har item se ek `TodoItem` component banane ke liye.

16. **Why does React need key?**  
    Key React ko list items uniquely identify aur efficiently update karne mein help karti hai.

17. **What is filter()?**  
    Array method jo condition match karne wale elements ki new array banata hai.

18. **How do you add a Todo?**  
    Input trim/validate karke new object immutable way se todo array mein add hota hai.

19. **How do you delete a Todo?**  
    `filter()` selected ID ko exclude karke new array banata hai.

20. **How do you edit a Todo?**  
    `map()` matching ID ke object ko spread karke updated text set karta hai.

21. **How do you mark a Todo completed?**  
    Checkbox click par matching todo ka `completed` boolean toggle hota hai.

22. **How do filters work?**  
    All full array dikhata hai; Active false values aur Completed true values filter karta hai.

23. **What is localStorage?**  
    Browser storage jo data ko refresh aur browser restart ke baad bhi rakhta hai.

24. **Why did you use localStorage?**  
    Practical ko backend nahi chahiye; localStorage simple local persistence deta hai.

25. **What is JSON.stringify()?**  
    Object/array ko JSON string mein convert karta hai.

26. **What is JSON.parse()?**  
    JSON string ko JavaScript object/array mein convert karta hai.

27. **How does data survive refresh?**  
    State localStorage mein save hoti hai aur next load par lazy `useState` initializer read karta hai.

28. **Why did you not use a backend?**  
    Question React Todo app ka hai; local device persistence ke liye backend unnecessary tha.

29. **What makes this app robust?**  
    Validation, trimmed input, safe storage loading, immutable updates, empty states, responsive layout, and accessibility.

30. **Explain the complete TaskFlow flow.**  
    Form input App state update karta hai, list components state render karte hain, actions state change karte hain, aur `useEffect` latest state localStorage mein save karta hai.

## 15. Compact practical write-up

### A. Practical Name

Robust Todo List App using ReactJS — TaskFlow

### B. Aim

ReactJS functional components and Hooks ka use karke a robust, responsive Todo application banana jo browser localStorage mein data persist kare.

### C. Technologies Used

ReactJS, Vite, JavaScript, CSS, HTML, and browser localStorage.

### D. Software Requirements

Node.js LTS, npm, VS Code or another code editor, and a modern web browser.

### E. Functional Requirements

Add, view, edit, delete, complete/uncomplete, filter, active counter, clear completed, validation, empty states, and refresh persistence.

### F. React Components

`App`, `TodoForm`, `TodoList`, and `TodoItem`.

### G. Working

The form validates a task and sends it to `App`. App updates the todo array. React re-renders the filtered list. TodoItem buttons call parent functions through props for toggle, edit, and delete operations.

### H. localStorage Usage

Initial todos are read using `JSON.parse()`. Every todo state change triggers `useEffect`, which saves the array using `JSON.stringify()` under `taskflow-todos`.

### I. Expected Output

A polished single-screen task manager where todos can be safely managed and remain available after refresh.

### J. Result

TaskFlow was successfully created and verified as a robust ReactJS Todo List application.

## 16. Algorithm

1. Start the React application.
2. Load saved todos from localStorage.
3. Display the Todo interface.
4. Accept todo text from the user.
5. Trim and validate the input.
6. Add a valid todo to state.
7. Render the todo list.
8. Allow complete or uncomplete.
9. Allow edit and validate edited text.
10. Allow delete for the selected todo.
11. Filter All, Active, or Completed todos.
12. Calculate the active task count.
13. Allow clearing all completed todos.
14. Save todo state to localStorage.
15. Re-render the UI after each state change.
16. Stop when the application closes.

## 17. Final requirement check

- A–F: ReactJS; add, view, edit, delete, complete, and uncomplete — verified.
- G–K: Filters, counter, Clear Completed, localStorage, and refresh retention — verified.
- L–M: Responsive and robust for normal actions — verified at desktop, tablet, and mobile widths.
- N: Original TaskFlow violet/neutral productivity UI; no previous branding or copied event layout.
- O: Six important source files total 680 lines and are suitable for the requested Xerox set.

**FINAL STATUS: PASS — TaskFlow is ready for ReactJS college practical submission.**
