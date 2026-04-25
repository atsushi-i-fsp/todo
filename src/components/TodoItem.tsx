import { useState } from 'react'
import type { Todo } from '../types/todo'
import type { UpdateTodoInput } from '../hooks/useTodos'
import { TodoForm } from './TodoForm'

const PRIORITY_BADGE: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-emerald-100 text-emerald-700',
}
const PRIORITY_LABEL: Record<string, string> = {
  high: '高', medium: '中', low: '低',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
}

function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

interface Props {
  todo: Todo
  categories: string[]
  onToggle: (id: string) => void
  onUpdate: (id: string, input: UpdateTodoInput) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, categories, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const overdue = isOverdue(todo.dueDate, todo.completed)

  if (editing) {
    return (
      <li className="bg-white border border-indigo-200 rounded-xl shadow-sm p-4 animate-slide-down">
        <TodoForm
          initialValues={todo}
          categories={categories}
          submitLabel="保存"
          onSubmit={input => { onUpdate(todo.id, input); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className={`group bg-white border rounded-xl shadow-sm px-4 py-3 flex items-start gap-3 transition-opacity animate-fade-in ${
      todo.completed ? 'opacity-60' : ''
    } ${overdue ? 'border-red-200' : 'border-slate-200'}`}>
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了にする' : '完了にする'}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{todo.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${PRIORITY_BADGE[todo.priority]}`}>
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.category && (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
              {todo.category}
            </span>
          )}
          {todo.dueDate && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              overdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {overdue && '⚠ '}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!confirmDelete ? (
          <>
            <button
              onClick={() => setEditing(true)}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="編集"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="削除"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1 animate-fade-in">
            <span className="text-xs text-red-600 font-medium">削除?</span>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-2 py-0.5 rounded text-xs bg-red-600 text-white hover:bg-red-700 font-medium"
            >はい</button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
            >いいえ</button>
          </div>
        )}
      </div>
    </li>
  )
}
