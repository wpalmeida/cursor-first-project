import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoFormData {
  title: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { register, handleSubmit, reset } = useForm<TodoFormData>();

  const onSubmit = async (data: TodoFormData) => {
    try {
      const response = await axios.post('http://localhost:3001/todos', data);
      setTodos([...todos, response.data]);
      reset();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await axios.patch(`http://localhost:3001/todos/${id}`, { completed });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="flex gap-2">
          <input
            {...register('title')}
            type="text"
            placeholder="Add a new todo"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-4 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, !todo.completed)}
              className="h-5 w-5"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-3 py-1 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 