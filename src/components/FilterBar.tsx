import type { FilterState, FilterStatus, Priority } from '../types/todo'

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'すべて' },
  { value: 'active',    label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

const PRIORITY_OPTS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all',    label: '全優先度' },
  { value: 'high',   label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low',    label: '低' },
]

interface Props {
  filter: FilterState
  categories: string[]
  totalActive: number
  totalCompleted: number
  onFilter: (f: Partial<FilterState>) => void
  onClearCompleted: () => void
}

export function FilterBar({ filter, categories, totalActive, totalCompleted, onFilter, onClearCompleted }: Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="input pl-9"
          placeholder="タスクを検索…"
          value={filter.search}
          onChange={e => onFilter({ search: e.target.value })}
        />
        {filter.search && (
          <button
            onClick={() => onFilter({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status tabs + priority + category */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status tabs */}
        <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => onFilter({ status: t.value })}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter.status === t.value
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          className="input w-auto text-sm py-1"
          value={filter.priority}
          onChange={e => onFilter({ priority: e.target.value as Priority | 'all' })}
        >
          {PRIORITY_OPTS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            className="input w-auto text-sm py-1"
            value={filter.category}
            onChange={e => onFilter({ category: e.target.value })}
          >
            <option value="">全カテゴリ</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        <div className="flex-1" />

        {/* Stats + clear completed */}
        <span className="text-xs text-slate-500">{totalActive} 件残り</span>
        {totalCompleted > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            完了済みを削除
          </button>
        )}
      </div>
    </div>
  )
}
