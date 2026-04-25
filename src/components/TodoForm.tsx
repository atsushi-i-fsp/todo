import { useState, useRef, useEffect } from 'react'
import type { Priority, Todo } from '../types/todo'
import type { CreateTodoInput } from '../hooks/useTodos'

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'high',   label: '高',   color: 'text-red-600' },
  { value: 'medium', label: '中',   color: 'text-amber-500' },
  { value: 'low',    label: '低',   color: 'text-emerald-600' },
]

interface Props {
  initialValues?: Todo
  categories: string[]
  onSubmit: (input: CreateTodoInput) => void
  onCancel?: () => void
  submitLabel?: string
}

export function TodoForm({ initialValues, categories, onSubmit, onCancel, submitLabel = '追加' }: Props) {
  const [title, setTitle]           = useState(initialValues?.title ?? '')
  const [description, setDesc]      = useState(initialValues?.description ?? '')
  const [priority, setPriority]     = useState<Priority>(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate]       = useState(initialValues?.dueDate ?? '')
  const [catInput, setCatInput]     = useState(initialValues?.category ?? '')
  const [showCatList, setShowCatList] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const filteredCats = categories.filter(c =>
    c.toLowerCase().includes(catInput.toLowerCase()) && c !== catInput
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title,
      description,
      priority,
      category: catInput,
      dueDate: dueDate || null,
    })
    if (!initialValues) {
      setTitle('')
      setDesc('')
      setPriority('medium')
      setCatInput('')
      setDueDate('')
      titleRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-slide-down">
      {/* Title */}
      <div>
        <label className="label">タイトル <span className="text-red-500">*</span></label>
        <input
          ref={titleRef}
          className="input"
          placeholder="何をしますか？"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">メモ</label>
        <textarea
          className="input resize-none"
          rows={2}
          placeholder="詳細メモ（任意）"
          value={description}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      {/* Priority / Category / DueDate row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Priority */}
        <div>
          <label className="label">優先度</label>
          <select
            className="input"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            {PRIORITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <label className="label">カテゴリ</label>
          <input
            className="input"
            placeholder="仕事, 個人…"
            value={catInput}
            onChange={e => { setCatInput(e.target.value); setShowCatList(true) }}
            onFocus={() => setShowCatList(true)}
            onBlur={() => setTimeout(() => setShowCatList(false), 150)}
            autoComplete="off"
          />
          {showCatList && filteredCats.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg text-sm overflow-hidden">
              {filteredCats.map(c => (
                <li
                  key={c}
                  className="px-3 py-1.5 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700"
                  onMouseDown={() => { setCatInput(c); setShowCatList(false) }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Due date */}
        <div>
          <label className="label">期日</label>
          <input
            type="date"
            className="input"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
