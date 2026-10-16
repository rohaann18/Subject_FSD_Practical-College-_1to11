import { useState } from 'react'

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [error, setError] = useState('')

  const saveEdit = () => {
    const cleanText = editText.trim()

    if (!cleanText) {
      setError('Task text cannot be empty.')
      return
    }

    onUpdate(todo.id, cleanText)
    setIsEditing(false)
    setError('')
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
    setError('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') saveEdit()
    if (event.key === 'Escape') cancelEdit()
  }

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="edit-area">
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>
            Edit task
          </label>
          <input
            id={`edit-${todo.id}`}
            className="edit-input"
            value={editText}
            onChange={(event) => {
              setEditText(event.target.value)
              if (error) setError('')
            }}
            onKeyDown={handleKeyDown}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `edit-error-${todo.id}` : undefined}
            autoFocus
          />
          {error && (
            <p className="edit-error" id={`edit-error-${todo.id}`} role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="item-actions">
          <button className="save-button" type="button" onClick={saveEdit}>Save</button>
          <button className="text-button" type="button" onClick={cancelEdit}>Cancel</button>
        </div>
      </li>
    )
  }

  return (
    <li className={todo.completed ? 'todo-item completed' : 'todo-item'}>
      <label className="check-control">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark ${todo.text} as ${todo.completed ? 'active' : 'completed'}`}
        />
        <span className="custom-check" aria-hidden="true">✓</span>
      </label>
      <span className="todo-text">{todo.text}</span>
      <div className="item-actions">
        <button className="text-button" type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="delete-button" type="button" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TodoItem
