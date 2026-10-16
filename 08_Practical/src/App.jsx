import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'

const STORAGE_KEY = 'taskflow-todos'
const FILTERS = ['All', 'Active', 'Completed']

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text) => {
    setTodos((current) => [
      ...current,
      { id: Date.now(), text, completed: false },
    ])
  }

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const updateTodo = (id, text) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    )
  }

  const deleteTodo = (id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed
    if (filter === 'Completed') return todo.completed
    return true
  })

  const activeCount = todos.filter((todo) => !todo.completed).length
  const hasCompleted = todos.some((todo) => todo.completed)

  return (
    <main className="page-shell">
      <section className="task-app" aria-labelledby="app-title">
        <header className="app-header">
          <div className="brand-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <p className="eyebrow">Daily focus</p>
            <h1 id="app-title">TaskFlow</h1>
            <p className="tagline">Organize today. Accomplish more.</p>
          </div>
        </header>

        <TodoForm onAdd={addTodo} />

        <div className="task-summary">
          <div className="filters" aria-label="Filter tasks">
            {FILTERS.map((name) => (
              <button
                className={filter === name ? 'filter-button active' : 'filter-button'}
                key={name}
                onClick={() => setFilter(name)}
                type="button"
                aria-pressed={filter === name}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="task-count" aria-live="polite">
            <strong>{activeCount}</strong> {activeCount === 1 ? 'task' : 'tasks'} left
          </p>
        </div>

        <TodoList
          todos={filteredTodos}
          filter={filter}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />

        <footer className="app-footer">
          <p>{todos.length ? `${todos.length} total` : 'Your list is clear'}</p>
          <button
            className="clear-button"
            type="button"
            onClick={clearCompleted}
            disabled={!hasCompleted}
          >
            Clear Completed
          </button>
        </footer>
      </section>
      <p className="page-note">Small steps, steady progress.</p>
    </main>
  )
}

export default App
