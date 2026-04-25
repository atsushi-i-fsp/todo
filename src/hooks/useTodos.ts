import { useState, useCallback } from 'react'
import type { Todo, Priority } from '../types/todo'

const STORAGE_KEY = 'todo-app-todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Todo[]
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface CreateTodoInput {
  title: string
  description: string
  priority: Priority
  category: string
  dueDate: string | null
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  completed?: boolean
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  const addTodo = useCallback((input: CreateTodoInput) => {
    const now = new Date().toISOString()
    const todo: Todo = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description.trim(),
      completed: false,
      priority: input.priority,
      category: input.category.trim(),
      dueDate: input.dueDate || null,
      createdAt: now,
      updatedAt: now,
    }
    setTodos(prev => {
      const next = [todo, ...prev]
      saveTodos(next)
      return next
    })
  }, [])

  const updateTodo = useCallback((id: string, input: UpdateTodoInput) => {
    setTodos(prev => {
      const next = prev.map(t =>
        t.id === id
          ? {
              ...t,
              ...input,
              title: input.title !== undefined ? input.title.trim() : t.title,
              description: input.description !== undefined ? input.description.trim() : t.description,
              category: input.category !== undefined ? input.category.trim() : t.category,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
      saveTodos(next)
      return next
    })
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => {
      const next = prev.filter(t => t.id !== id)
      saveTodos(next)
      return next
    })
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => {
      const next = prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
      saveTodos(next)
      return next
    })
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => {
      const next = prev.filter(t => !t.completed)
      saveTodos(next)
      return next
    })
  }, [])

  const categories = Array.from(new Set(todos.map(t => t.category).filter(Boolean))).sort()

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, categories }
}
