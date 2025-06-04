import axios from "axios";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    countTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos() {
      try {
        const response = await axios.get("http://localhost:3100/tasks");
        this.todos = response.data;
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    },

    async toggleStatus(id) {
      const foundIndex = this.todos.findIndex((t) => t.id === id);
      if (foundIndex >= 0) {
        try {
          let url;
          let updateBody;

          if (this.todos[foundIndex].completedAt != null) {
            // Task is completed, mark as pending
            url = `http://localhost:3100/tasks/${id}/pending`;
            updateBody = { completedAt: null };
          } else {
            // Task is pending, mark as completed
            url = `http://localhost:3100/tasks/${id}/done`;
            updateBody = { completedAt: new Date().toISOString() };
          }

          const response = await axios.patch(url, updateBody);
          console.log("PATCH response:", response.data);

          // Use splice to replace item (ensures Vue reactivity)
          this.todos.splice(foundIndex, 1, response.data);

          // Optionally force refetch to debug:
          // await this.fetchTodos();
        } catch (error) {
          console.error("Failed to toggle task status:", error);
        }
      }
    },

    async addTodo(todo) {
      const newTodo = {
        name: todo,
        description: "description",
        userId: 1, // make sure this is a valid user id number
      };

      try {
        const response = await axios.post("http://localhost:3100/tasks", newTodo);
        this.todos.push(response.data);
      } catch (error) {
        console.error("Failed to add todo:", error?.response?.data || error);
      }
    },

    async clearAll() {
      try {
        await axios.delete("http://localhost:3100/tasks");
        await this.fetchTodos();
      } catch (error) {
        console.log("Failed to soft delete all todos: ", error);
      }
    },
  },
});
