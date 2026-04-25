import { useState, useMemo } from 'react'
import { useTodos } from './hooks/useTodos'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { FilterBar } from './components/FilterBar'
import { EmptyState } from './components/EmptyState'
import type { FilterState } from './types/todo'

const DEFAULT_FILTER: FilterState = {
  status: 'all',
  priority: 'all',
  category: '',
  search: '',
}

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, categories } = useTodos()
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [showForm, setShowForm] = useState(false)

  function patchFilter(f: Partial<FilterState>) {
    setFilter(prev => ({ ...prev, ...f }))
  }

  const filtered = useMemo(() => {
    return todos.filter(t => {
      if (filter.status === 'active' && t.completed) return false
      if (filter.status === 'completed' && !t.completed) return false
      if (filter.priority !== 'all' && t.priority !== filter.priority) return false
      if (filter.category && t.category !== filter.category) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [todos, filter])

  const totalActive    = todos.filter(t => !t.completed).length
  const totalCompleted = todos.filter(t =>  t.completed).length
  const hasFilter      = filter.status !== 'all' || filter.priority !== 'all' || !!filter.category || !!filter.search

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              <span className="text-indigo-600">Todo</span> App
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {todos.length === 0 ? 'タスクを追加してスタート' : `全${todos.length}件 / 未完了${totalActive}件`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className={`btn-primary gap-2 ${showForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : ''}`}
          >
            <svg className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? '閉じる' : '新規タスク'}
          </button>
        </header>

        {/* Add form */}
        {showForm && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">新しいタスク</h2>
            <TodoForm
              categories={categories}
              onSubmit={input => { addTodo(input); setShowForm(false) }}
              onCancel={() => setShowForm(false)}
            />
          </section>
        )}

        {/* Filters */}
        {todos.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <FilterBar
              filter={filter}
              categories={categories}
              totalActive={totalActive}
              totalCompleted={totalCompleted}
              onFilter={patchFilter}
              onClearCompleted={clearCompleted}
            />
          </section>
        )}

        {/* Todo list */}
        <section>
          {filtered.length === 0 ? (
            <EmptyState hasFilter={hasFilter} />
          ) : (
            <ul className="space-y-2">
              {filtered.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  categories={categories}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pb-4">
          データはブラウザの localStorage に保存されます
        </footer>
      </div>
    </div>
  )
}
