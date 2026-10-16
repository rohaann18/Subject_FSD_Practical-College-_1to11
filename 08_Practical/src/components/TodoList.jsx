import TodoItem from './TodoItem.jsx'

const emptyMessages = {
  All: ['No tasks yet.', 'Add your first task to get started.'],
  Active: ['No active tasks.', 'You are all caught up.'],
  Completed: ['No completed tasks.', 'Finished tasks will appear here.'],
}

function TodoList({ todos, filter, onToggle, onUpdate, onDelete }) {
  if (!todos.length) {
    const [title, message] = emptyMessages[filter]

    return (
      <div className="empty-state" role="status">
        <div className="empty-icon" aria-hidden="true">✓</div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <ul className="todo-list" aria-label={`${filter} tasks`}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
