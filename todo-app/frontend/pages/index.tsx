import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
}

interface TodoFormData {
  title: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Home() {
  const { data: todos, error } = useSWR<Todo[]>('http://localhost:3001/todos', fetcher);
  const { register, handleSubmit, reset } = useForm<TodoFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TodoFormData) => {
    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:3001/todos', data);
      await mutate('http://localhost:3001/todos');
      reset();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      await axios.patch(`http://localhost:3001/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      await mutate('http://localhost:3001/todos');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      await mutate('http://localhost:3001/todos');
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (error) return <div>Failed to load todos</div>;
  if (!todos) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">Todo List</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
                  <div className="flex items-center space-x-4">
                    <input
                      {...register('title', { required: true })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Add a new todo..."
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </form>

                <ul className="space-y-4">
                  {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 