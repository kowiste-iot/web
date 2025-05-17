import { defineStore } from 'pinia'

interface State {
  _todos: string[]
}

export const useTodoStore = defineStore('todo', {
  state: (): State => ({
    _todos: [],
  }),
  actions: {
    addTodo(text: string) {
      this._todos.push('sdfsd')
    },
    removeTodo(text: string) {
      this._todos = this._todos.filter((todo) => todo !== text)
    },
  },
})
