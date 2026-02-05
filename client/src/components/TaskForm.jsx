import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

export default function TaskForm({ task, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'Pending');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await taskService.updateTask(task._id, {
          title: title.trim(),
          description: description.trim(),
          status,
        });
      } else {
        await taskService.createTask({
          title: title.trim(),
          description: description.trim(),
          status,
        });
      }
      toast.success(isEdit ? 'Task updated' : 'Task created');
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (isEdit ? 'Failed to update task.' : 'Failed to create task.')
      );
      toast.error(
        err.response?.data?.error ||
          (isEdit ? 'Failed to update task.' : 'Failed to create task.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 rounded-xl border border-sand-200 shadow-soft p-6 animate-scale-in dark:bg-primary-600/40 dark:border-primary-700">
      <h3 className="text-lg font-semibold text-primary-700 mb-4 dark:text-sand-50">
        {isEdit ? 'Edit Task' : 'New Task'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5 dark:text-secondary-200">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none
                       dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
            placeholder="Task title"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5 dark:text-secondary-200">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-sand-50/40 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none resize-none
                       dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
            placeholder="Optional description"
            disabled={loading}
          />
        </div>

        {isEdit ? (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5 dark:text-secondary-200">
              Status
            </label>
            <p className="text-xs text-secondary-500 mb-1 dark:text-secondary-300">
              Drag this task between columns on the board to change its status.
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sand-100 text-secondary-700 border border-sand-300
                             dark:bg-primary-900/40 dark:text-secondary-200 dark:border-primary-700">
              {status}
            </span>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1.5 dark:text-secondary-200">
              Status
            </label>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-300 bg-white/90 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none pr-9 appearance-none
                           dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50"
                disabled={loading}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-500 dark:text-secondary-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-accent-500 text-primary-900 font-semibold hover:bg-accent-600 disabled:opacity-50 transition-transform transform hover:-translate-y-0.5 hover:shadow-soft"
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-sand-300 text-secondary-700 font-medium hover:bg-sand-100/80 disabled:opacity-50 transition
                       dark:border-primary-700 dark:text-secondary-200 dark:hover:bg-primary-900/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
