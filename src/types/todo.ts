export type Priority = 'high' | 'medium' | 'low'
export type FilterStatus = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface FilterState {
  status: FilterStatus
  priority: Priority | 'all'
  category: string
  search: string
}
