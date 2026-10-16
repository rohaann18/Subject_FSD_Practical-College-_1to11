import { useState } from 'react'

function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanText = text.trim()

    if (!cleanText) {
      setError('Please enter a task before adding it.')
      return
    }

    onAdd(cleanText)
    setText('')
    setError('')
  }

  const handleChange = (event) => {
    setText(event.target.value)
    if (error) setError('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-todo">Add a new task</label>
      <div className="form-row">
        <input
          id="new-todo"
          value={text}
          onChange={handleChange}
          placeholder="What needs to be done?"
          autoComplete="off"
          aria-describedby={error ? 'todo-error' : undefined}
          aria-invalid={Boolean(error)}
        />
        <button type="submit">Add Task</button>
      </div>
      {error && (
        <p className="form-error" id="todo-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default TodoForm
