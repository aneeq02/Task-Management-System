import { useState } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const statusColors = {
  Pending:
    'bg-sand-50 text-secondary-700 border border-sand-200 dark:bg-primary-900/30 dark:text-secondary-200 dark:border-primary-700',
  'In Progress':
    'bg-secondary-100 text-secondary-800 border border-secondary-200 dark:bg-primary-900/30 dark:text-secondary-200 dark:border-primary-700',
  Completed:
    'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;

    const toastId = toast.custom(
      (t) => (
        <div
          className={`mx-auto w-full max-w-sm rounded-2xl bg-white shadow-soft border border-sand-200 p-4 flex flex-col gap-3 ${
            t.visible ? 'animate-fade-in-up' : 'opacity-0'
          }
          dark:bg-primary-800/80 dark:border-primary-700`}
        >
          <p className="text-sm font-semibold text-primary-700 dark:text-sand-50">
            Delete this task?
          </p>
          <p className="text-xs text-secondary-600 line-clamp-2 dark:text-secondary-200">
            “{task.title}” will be permanently removed.
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => toast.dismiss(toastId)}
              className="px-3 py-1.5 rounded-lg border border-sand-300 text-secondary-700 text-xs font-medium hover:bg-sand-100/80
                         dark:border-primary-700 dark:text-secondary-200 dark:hover:bg-primary-900/40"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(toastId);
                setDeleting(true);
                try {
                  await taskService.deleteTask(task._id);
                  onDelete();
                  toast.success('Task deleted');
                } catch (err) {
                  toast.error(err.response?.data?.error || 'Failed to delete.');
                } finally {
                  setDeleting(false);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const created = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className="
        bg-white/95 rounded-xl border border-sand-200 shadow-card p-5 hover:shadow-soft transition-shadow animate-fade-in-up
        dark:bg-primary-800/70 dark:border-primary-700
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-primary-700 truncate dark:text-sand-50">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm text-secondary-600 line-clamp-2 dark:text-secondary-200">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[task.status] ||
                'bg-sand-50 text-secondary-700 border border-sand-200 dark:bg-primary-900/30 dark:text-secondary-200 dark:border-primary-700'
              }`}
            >
              {task.status}
            </span>

            {created && (
              <span className="text-xs text-secondary-400 dark:text-secondary-400">
                {created}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg text-secondary-500 hover:bg-sand-100 hover:text-primary-700 transition
                       dark:text-secondary-300 dark:hover:bg-primary-900/40 dark:hover:text-sand-50"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg text-secondary-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50
                       dark:text-secondary-300 dark:hover:bg-red-900/20 dark:hover:text-red-300"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
