interface Props {
  hasFilter: boolean
}

export function EmptyState({ hasFilter }: Props) {
  return (
    <div className="text-center py-16 animate-fade-in">
      {hasFilter ? (
        <>
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 text-sm">条件に一致するタスクがありません</p>
        </>
      ) : (
        <>
          <div className="text-5xl mb-3">✨</div>
          <p className="text-slate-600 font-medium">タスクはありません</p>
          <p className="text-slate-400 text-sm mt-1">上のフォームから追加してみましょう</p>
        </>
      )}
    </div>
  )
}
