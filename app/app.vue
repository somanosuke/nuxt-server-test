<template>
  <div class="container">
    <h1>📝 タスク管理</h1>

    <form @submit.prevent="addTask" class="add-form">
      <input v-model="newTitle" placeholder="新しいタスクを入力..." required />
      <button type="submit">追加</button>
    </form>

    <ul class="task-list">
      <li
        v-for="task in tasks"
        :key="task.id"
        :class="{ completed: task.completed }"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task)"
        />
        <span class="title">{{ task.title }}</span>
        <button @click="deleteTask(task.id)" class="delete">✕</button>
      </li>
    </ul>

    <p v-if="tasks.length === 0" class="empty">タスクがありません</p>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

const tasks = ref<Task[]>([]);
const newTitle = ref("");

const fetchTasks = async () => {
  tasks.value = await $fetch<Task[]>("/api/tasks");
};

const addTask = async () => {
  if (!newTitle.value.trim()) return;
  await $fetch("/api/tasks", {
    method: "POST",
    body: { title: newTitle.value },
  });
  newTitle.value = "";
  await fetchTasks();
};

const toggleTask = async (task: Task) => {
  await $fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    body: { title: task.title, completed: !task.completed },
  });
  await fetchTasks();
};

const deleteTask = async (id: number) => {
  await $fetch(`/api/tasks/${id}`, { method: "DELETE" });
  await fetchTasks();
};

onMounted(fetchTasks);
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 20px;
  font-size: 24px;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.add-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.add-form button {
  padding: 10px 20px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-form button:hover {
  background: #0060df;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.task-list li:last-child {
  border-bottom: none;
}

.task-list li.completed .title {
  text-decoration: line-through;
  color: #999;
}

.task-list .title {
  flex: 1;
}

.task-list .delete {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
}

.task-list .delete:hover {
  background: #fff0f0;
  border-radius: 4px;
}

.empty {
  text-align: center;
  color: #999;
}
</style>
