import { defineStore } from 'pinia'

interface State {
  todos: string[]
}

export const useTodoStore = defineStore('todo', {
  state: (): State => ({
    todos: [],
  }),
  actions: {
    addTodo(text: string) {
      this.todos.push('sdfsd')
    },
    removeTodo(text: string) {
      this.todos = this.todos.filter((todo) => todo !== text)
    },
  },
})
