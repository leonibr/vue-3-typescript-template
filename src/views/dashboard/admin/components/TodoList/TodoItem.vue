<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, type DirectiveBinding, nextTick } from 'vue'

export interface ITodo {
  text: string
  done: boolean
}

export default defineComponent({
  name: 'TodoDemo',
  props: {
    todo: {
      type: Object as PropType<ITodo>,
      default: () => ({ text: '', done: false })
    }
  },
  directives: {
    focus: {
      created(el: HTMLElement, { value }: DirectiveBinding<HTMLElement>, { appContext }) {
        if (value) {
          if (appContext) {
            nextTick(() => {
              el.focus()
            })
          }
        }
      }
    }
  },
  setup() {
    const editing = ref(false)
    return {
      editing
    }
  },
  methods: {
    deleteTodo(todo: ITodo) {
      this.$emit('delete-todo', todo)
    },

    editTodo({ todo, value }: { todo: ITodo; value: string }) {
      this.$emit('edit-todo', { todo, value })
    },

    toggleTodo(todo: ITodo) {
      this.$emit('toggle-todo', todo)
    },

    doneEdit(e: FocusEvent | KeyboardEvent) {
      const value = (e.target as HTMLInputElement).value.trim()
      const { todo } = this
      if (!value) {
        this.deleteTodo(todo)
      } else if (this.editing) {
        this.editTodo({
          todo,
          value
        })
        this.editing = false
      }
    },

    cancelEdit(e: KeyboardEvent) {
      ;(e.target as HTMLInputElement).value = this.todo.text
      this.editing = false
    }
  }
})
</script>
