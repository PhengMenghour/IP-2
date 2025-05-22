<template>
  <div class="container">
    <AddTodo @added="handleAddTodo" />
    <h3>Pending Tasks:</h3>
    <TodoLists status="pending" />

    <h3>Completed Tasks:</h3>
    <TodoLists status="completed" />
    <div class="pending-tasks">
      <span>You have <span class="pending-num"> {{ nbOfTodo }} </span> tasks
        pending.</span>
    </div>
    <div class="button-container">
      <button class="clear-button" @click="clearAllTodos()">Clear All</button>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import AddTodo from "./components/AddTodo.vue";
import TodoLists from "./components/TodoList.vue";

import { useTodoStore } from "./stores/todo";
export default {
  name: "App",
  setup() {
    const store = useTodoStore();
    return {
      store,
    };
  },
  components: {
    AddTodo,
    TodoLists,
  },
  computed: {
    ...mapState(useTodoStore, {
      nbOfTodo: "countTodos",
    }),
  },
  methods: {
    handleAddTodo(todo) {
      this.store.addTodo(todo);
    },
    clearAllTodos() {
      console.log("clear");
      this.store.clearAll();
    },
  },
};
</script>

<style scoped>
@import "https://unicons.iconscout.com/release/v4.0.0/css/line.css";

.pending-tasks {
  display: flex;

}

.button-container{
  display: flex;
  justify-content: center;
}

.clear-button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
}
</style>
