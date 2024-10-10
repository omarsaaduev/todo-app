import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface FormValues {
  task: string;
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setTasks([...tasks, { id: Date.now(), text: data.task, completed: false }]);
    reset();
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>ToDo App</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="What needs to be done?"
          {...register("task", { required: "Task is required" })}
        />
        {errors.task && <p className="error-message">{errors.task.message}</p>}
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`card ${task.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>

      <div className="filters">
        <span>{tasks.filter((task) => !task.completed).length} items left</span>
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button onClick={handleClearCompleted} style={{ color: "red" }}>
          Clear Completed
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
